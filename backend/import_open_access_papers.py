import hashlib
import os
import re
import time
from datetime import datetime, timezone

import requests
import pymupdf

from app.config.database import db
from app.services.topic_similarity import embedding_model


# ============================================================
# DATABASE
# ============================================================

sources_collection = db["plagiarism_sources"]
chunks_collection = db["plagiarism_chunks"]


# ============================================================
# SETTINGS
# ============================================================

API_URL = (
    "https://api.semanticscholar.org/graph/v1/"
    "paper/search/bulk"
)

DOWNLOAD_FOLDER = "open_access_papers"

# Maximum papers we actually TRY to import per topic.
MAX_PAPERS_PER_TOPIC = 4

# We inspect only this many candidates from the API response.
# This prevents the script from walking through hundreds of papers.
MAX_CANDIDATES_PER_TOPIC = 20

MIN_DOCUMENT_WORDS = 800

MIN_WORDS_PER_CHUNK = 80
MAX_WORDS_PER_CHUNK = 180

REQUEST_TIMEOUT = 15

MIN_CITATIONS = 2

# Recent academic papers are generally more useful for the
# prototype reference corpus.
MIN_YEAR = 2020


# ============================================================
# SEARCH TOPICS
# ============================================================

SEARCH_TOPICS = [

    "software engineering",

    "machine learning",

    "artificial intelligence",

    "data science",

    "cybersecurity",

    "computer networks",

]


# ============================================================
# OPTIONAL API KEY
# ============================================================

S2_API_KEY = os.getenv(
    "S2_API_KEY"
)


# ============================================================
# HTTP SESSION
# ============================================================

session = requests.Session()

session.headers.update(
    {
        "User-Agent":
            "ResearchSync-AI/1.0",
        "Accept":
            "application/json",
    }
)


if S2_API_KEY:

    session.headers.update(
        {
            "x-api-key":
                S2_API_KEY
        }
    )


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(text):

    if not text:

        return ""

    text = text.replace(
        "\x00",
        " "
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# ============================================================
# PAGE NUMBER
# ============================================================

def is_page_number(line):

    return bool(
        re.fullmatch(
            r"(page\s*)?\d+",
            line.strip().lower()
        )
    )


# ============================================================
# CLEAN PDF
# ============================================================

def clean_pdf_text(pages):

    cleaned_pages = []

    # --------------------------------------------------------
    # Detect repeated headers / footers
    # --------------------------------------------------------

    line_counts = {}

    for page_text in pages:

        seen = set()

        for raw_line in page_text.splitlines():

            line = normalize_text(
                raw_line
            )

            if not line:
                continue

            if len(line) > 150:
                continue

            if line in seen:
                continue

            seen.add(line)

            line_counts[line] = (
                line_counts.get(
                    line,
                    0
                ) + 1
            )


    total_pages = max(
        len(pages),
        1
    )


    repeated_lines = {

        line

        for line, count in line_counts.items()

        if count >= max(
            4,
            int(total_pages * 0.35)
        )

    }


    # --------------------------------------------------------
    # Clean pages
    # --------------------------------------------------------

    for page_text in pages:

        page_lines = []

        for raw_line in page_text.splitlines():

            line = normalize_text(
                raw_line
            )

            if not line:
                continue

            if line in repeated_lines:
                continue

            if is_page_number(line):
                continue

            page_lines.append(
                line
            )

        if page_lines:

            cleaned_pages.append(
                " ".join(
                    page_lines
                )
            )


    text = "\n".join(
        cleaned_pages
    ).strip()


    if not text:

        return ""


    # --------------------------------------------------------
    # Remove references / bibliography / appendix
    # --------------------------------------------------------

    end_patterns = [

        r"\nReferences\b",

        r"\nBibliography\b",

        r"\nReference List\b",

        r"\nAppendix\b",

        r"\nAppendices\b",

    ]


    positions = []


    for pattern in end_patterns:

        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        if match:

            positions.append(
                match.start()
            )


    if positions:

        text = text[
            :min(positions)
        ]


    # --------------------------------------------------------
    # Final cleanup
    # --------------------------------------------------------

    text = re.sub(
        r"\s+",
        " ",
        text
    )


    return text.strip()


# ============================================================
# CHUNK DOCUMENT
# ============================================================

def split_into_chunks(text):

    if not text:

        return []


    words = text.split()


    chunks = []


    start = 0


    while start < len(words):

        end = min(
            start + MAX_WORDS_PER_CHUNK,
            len(words)
        )


        chunk_words = words[
            start:end
        ]


        if len(chunk_words) >= MIN_WORDS_PER_CHUNK:

            chunks.append(
                " ".join(
                    chunk_words
                )
            )


        start = end


    return chunks


# ============================================================
# HASH
# ============================================================

def create_hash(text):

    normalized = re.sub(
        r"\W+",
        "",
        text.lower()
    )

    return hashlib.sha256(
        normalized.encode(
            "utf-8"
        )
    ).hexdigest()


# ============================================================
# CLEAR PREVIOUS SEMANTIC SCHOLAR IMPORTS
# ============================================================

def clear_previous_imports():

    print()
    print(
        "Removing previous Semantic Scholar imports..."
    )


    chunk_result = (
        chunks_collection.delete_many(
            {
                "source_type":
                    "semantic_scholar"
            }
        )
    )


    source_result = (
        sources_collection.delete_many(
            {
                "source_type":
                    "semantic_scholar"
            }
        )
    )


    print(
        "Removed chunks:",
        chunk_result.deleted_count
    )

    print(
        "Removed sources:",
        source_result.deleted_count
    )


# ============================================================
# SEARCH PAPERS
# ============================================================

def search_papers(query):

    params = {

        "query":
            query,

        "fields":
            (
                "paperId,"
                "title,"
                "authors,"
                "year,"
                "abstract,"
                "url,"
                "publicationDate,"
                "openAccessPdf"
            ),

        "openAccessPdf":
            "true",

        "year":
            f"{MIN_YEAR}-",

        "minCitationCount":
            MIN_CITATIONS,

        "fieldsOfStudy":
            "Computer Science",

        "sort":
            "citationCount:desc",

    }


    try:

        response = session.get(
            API_URL,
            params=params,
            timeout=REQUEST_TIMEOUT,
        )


    except requests.RequestException as error:

        print(
            "Search failed:",
            error
        )

        return []


    if response.status_code == 429:

        print(
            "Semantic Scholar rate limit reached."
        )

        return []


    if not response.ok:

        print(
            "Search failed:",
            response.status_code
        )

        return []


    try:

        data = response.json()

    except Exception:

        return []


    papers = data.get(
        "data",
        []
    )


    # --------------------------------------------------------
    # IMPORTANT:
    # We only inspect a small number of candidates.
    # --------------------------------------------------------

    return papers[
        :MAX_CANDIDATES_PER_TOPIC
    ]


# ============================================================
# DOWNLOAD PDF
# ============================================================

def download_pdf(
    pdf_url,
    paper_id
):

    if not pdf_url:

        return None


    os.makedirs(
        DOWNLOAD_FOLDER,
        exist_ok=True
    )


    file_path = os.path.join(
        DOWNLOAD_FOLDER,
        f"{paper_id}.pdf"
    )


    if os.path.exists(
        file_path
    ):

        return file_path


    try:

        response = session.get(
            pdf_url,
            timeout=REQUEST_TIMEOUT,
            allow_redirects=True,
        )


    except requests.RequestException as error:

        print(
            "Download failed."
        )

        print(
            str(error)[:200]
        )

        return None


    if not response.ok:

        print(
            "Download failed:",
            response.status_code
        )

        return None


    content = response.content


    # --------------------------------------------------------
    # Verify actual PDF
    # --------------------------------------------------------

    if not content.startswith(
        b"%PDF"
    ):

        print(
            "Skipped: resource is not a PDF."
        )

        return None


    # --------------------------------------------------------
    # Size check
    # --------------------------------------------------------

    if len(content) < 20_000:

        print(
            "Skipped: PDF is too small."
        )

        return None


    try:

        with open(
            file_path,
            "wb"
        ) as file:

            file.write(
                content
            )


    except OSError as error:

        print(
            "Could not save PDF:",
            error
        )

        return None


    return file_path


# ============================================================
# EXTRACT PDF
# ============================================================

def extract_pdf_text(
    file_path
):

    try:

        document = pymupdf.open(
            file_path
        )

    except Exception as error:

        print(
            "Could not open PDF:",
            error
        )

        return ""


    pages = []


    for page in document:

        try:

            pages.append(
                page.get_text(
                    "text"
                )
            )

        except Exception:

            pages.append("")


    page_count = len(
        document
    )


    document.close()


    text = clean_pdf_text(
        pages
    )


    return text, page_count


# ============================================================
# SAVE PAPER
# ============================================================

def save_paper(
    paper,
    pdf_path,
    text,
    chunks,
    page_count
):

    paper_id = paper.get(
        "paperId"
    )


    title = (
        paper.get(
            "title"
        )
        or
        "Untitled paper"
    )


    # --------------------------------------------------------
    # Authors
    # --------------------------------------------------------

    authors = []


    for author in (
        paper.get(
            "authors"
        )
        or []
    ):

        name = author.get(
            "name"
        )

        if name:

            authors.append(
                name
            )


    # --------------------------------------------------------
    # OA metadata
    # --------------------------------------------------------

    open_access = (
        paper.get(
            "openAccessPdf"
        )
        or {}
    )


    pdf_url = open_access.get(
        "url"
    )


    license_name = (
        open_access.get(
            "license"
        )
    )


    access_status = (
        open_access.get(
            "status"
        )
    )


    document_hash = create_hash(
        text
    )


    # --------------------------------------------------------
    # Duplicate check
    # --------------------------------------------------------

    existing = (
        sources_collection.find_one(
            {
                "$or": [

                    {
                        "external_id":
                            paper_id
                    },

                    {
                        "document_hash":
                            document_hash
                    },

                ]
            }
        )
    )


    if existing:

        print(
            "Skipped duplicate:"
        )

        print(
            title
        )

        return False


    # --------------------------------------------------------
    # Save source metadata
    # --------------------------------------------------------

    source_document = {

        "filename":
            os.path.basename(
                pdf_path
            ),

        "title":
            title,

        "authors":
            authors,

        "year":
            paper.get(
                "year"
            ),

        "document_type":
            "open_access_paper",

        "source_type":
            "semantic_scholar",

        "external_id":
            paper_id,

        "source_url":
            paper.get(
                "url"
            ),

        "pdf_url":
            pdf_url,

        "license":
            license_name,

        "access_status":
            access_status,

        "abstract":
            paper.get(
                "abstract"
            ),

        "document_hash":
            document_hash,

        "page_count":
            page_count,

        "chunk_count":
            len(chunks),

        "word_count":
            len(
                text.split()
            ),

        "created_at":
            datetime.now(
                timezone.utc
            ),

    }


    result = (
        sources_collection.insert_one(
            source_document
        )
    )


    source_id = (
        result.inserted_id
    )


    # --------------------------------------------------------
    # Generate embeddings
    # --------------------------------------------------------

    print(
        f"Generating embeddings for "
        f"{len(chunks)} chunks..."
    )


    embeddings = embedding_model.encode(
        chunks,
        convert_to_numpy=True,
        normalize_embeddings=True,
        show_progress_bar=True,
    )


    # --------------------------------------------------------
    # Save chunks
    # --------------------------------------------------------

    chunk_documents = []


    for index, (
        chunk_text,
        embedding
    ) in enumerate(
        zip(
            chunks,
            embeddings
        )
    ):

        chunk_documents.append(
            {

                "source_id":
                    source_id,

                "filename":
                    os.path.basename(
                        pdf_path
                    ),

                "title":
                    title,

                "document_type":
                    "open_access_paper",

                "source_type":
                    "semantic_scholar",

                "external_id":
                    paper_id,

                "source_url":
                    paper.get(
                        "url"
                    ),

                "pdf_url":
                    pdf_url,

                "license":
                    license_name,

                "access_status":
                    access_status,

                "chunk_index":
                    index,

                "word_count":
                    len(
                        chunk_text.split()
                    ),

                "text":
                    chunk_text,

                "embedding":
                    embedding.tolist(),

                "created_at":
                    datetime.now(
                        timezone.utc
                    ),

            }
        )


    chunks_collection.insert_many(
        chunk_documents
    )


    print()
    print(
        "IMPORTED:"
    )

    print(
        title
    )

    print(
        "Year:",
        paper.get(
            "year"
        )
    )

    print(
        "Pages:",
        page_count
    )

    print(
        "Words:",
        len(
            text.split()
        )
    )

    print(
        "Chunks:",
        len(chunks)
    )

    print(
        "License:",
        license_name
        or
        "Not provided"
    )

    print(
        "Source:",
        paper.get(
            "url"
        )
    )

    return True


# ============================================================
# PROCESS ONE PAPER
# ============================================================

def process_paper(
    paper
):

    title = (
        paper.get(
            "title"
        )
        or
        "Untitled"
    )


    paper_id = paper.get(
        "paperId"
    )


    open_access = (
        paper.get(
            "openAccessPdf"
        )
        or
        {}
    )


    pdf_url = open_access.get(
        "url"
    )


    if not paper_id:

        return False


    if not pdf_url:

        return False


    print()
    print(
        "-" * 60
    )

    print(
        "Candidate:",
        title
    )


    # --------------------------------------------------------
    # Download
    # --------------------------------------------------------

    pdf_path = download_pdf(
        pdf_url,
        paper_id
    )


    if not pdf_path:

        return False


    # --------------------------------------------------------
    # Extract
    # --------------------------------------------------------

    result = extract_pdf_text(
        pdf_path
    )


    text, page_count = result


    if not text:

        print(
            "Skipped: no extractable text."
        )

        return False


    # --------------------------------------------------------
    # Minimum content check
    # --------------------------------------------------------

    word_count = len(
        text.split()
    )


    if word_count < MIN_DOCUMENT_WORDS:

        print(
            f"Skipped: only {word_count} words."
        )

        return False


    # --------------------------------------------------------
    # Chunk
    # --------------------------------------------------------

    chunks = split_into_chunks(
        text
    )


    if len(chunks) < 3:

        print(
            f"Skipped: only {len(chunks)} usable chunks."
        )

        return False


    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    return save_paper(
        paper,
        pdf_path,
        text,
        chunks,
        page_count
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 70)
    print(
        "ResearchSync AI - "
        "Controlled Open Access Importer"
    )
    print("=" * 70)


    print()
    print(
        "Your 13 local reference documents will be kept."
    )


    # --------------------------------------------------------
    # Remove only previous Semantic Scholar imports
    # --------------------------------------------------------

    clear_previous_imports()


    # --------------------------------------------------------
    # Remove downloaded public PDFs
    # --------------------------------------------------------

    if os.path.exists(
        DOWNLOAD_FOLDER
    ):

        for filename in os.listdir(
            DOWNLOAD_FOLDER
        ):

            if filename.lower().endswith(
                ".pdf"
            ):

                try:

                    os.remove(
                        os.path.join(
                            DOWNLOAD_FOLDER,
                            filename
                        )
                    )

                except OSError:

                    pass


    imported_total = 0

    seen_papers = set()


    # ========================================================
    # TOPICS
    # ========================================================

    for topic in SEARCH_TOPICS:

        print()
        print("=" * 70)
        print(
            "TOPIC:",
            topic
        )
        print("=" * 70)


        papers = search_papers(
            topic
        )


        print(
            "Candidates inspected:",
            len(papers)
        )


        imported_for_topic = 0


        for paper in papers:

            if imported_for_topic >= (
                MAX_PAPERS_PER_TOPIC
            ):

                break


            paper_id = paper.get(
                "paperId"
            )


            if not paper_id:
                continue


            if paper_id in seen_papers:
                continue


            seen_papers.add(
                paper_id
            )


            imported = False


            try:

                imported = process_paper(
                    paper
                )

            except Exception as error:

                print(
                    "Skipped because of error:"
                )

                print(
                    str(error)[:300]
                )


            if imported:

                imported_total += 1

                imported_for_topic += 1


            # Small delay
            time.sleep(
                0.5
            )


        print()
        print(
            "Imported for this topic:",
            imported_for_topic
        )


        time.sleep(
            1
        )


    # ========================================================
    # FINAL COUNTS
    # ========================================================

    total_sources = (
        sources_collection.count_documents({})
    )


    total_chunks = (
        chunks_collection.count_documents({})
    )


    public_sources = (
        sources_collection.count_documents(
            {
                "source_type":
                    "semantic_scholar"
            }
        )
    )


    local_sources = (
        sources_collection.count_documents(
            {
                "source_type":
                    {
                        "$ne":
                            "semantic_scholar"
                    }
            }
        )
    )


    print()
    print("=" * 70)
    print(
        "IMPORT COMPLETE"
    )
    print("=" * 70)


    print(
        "New public papers imported:",
        imported_total
    )


    print(
        "Local reference documents:",
        local_sources
    )


    print(
        "Public papers:",
        public_sources
    )


    print(
        "Total reference documents:",
        total_sources
    )


    print(
        "Total reference chunks:",
        total_chunks
    )


    print("=" * 70)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    main()