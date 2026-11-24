import os
import re
import hashlib
from datetime import datetime, timezone

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

REFERENCE_FOLDER = "reference_documents"

MIN_WORDS_PER_CHUNK = 80
MAX_WORDS_PER_CHUNK = 180


# ============================================================
# DOCUMENT TYPE
# ============================================================

def detect_document_type(filename):

    name = filename.lower()

    if "proposal" in name:
        return "project_proposal"

    if "reflective" in name or "reflect" in name:
        return "reflective_report"

    if "contextual" in name or "contexual" in name:
        return "contextual_report"

    if "thesis" in name:
        return "thesis"

    return "academic_document"


# ============================================================
# NORMALIZE TEXT
# ============================================================

def normalize_line(text):

    if not text:
        return ""

    text = text.replace("\x00", " ")

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# ============================================================
# REMOVE PAGE NUMBERS
# ============================================================

def is_page_number(line):

    cleaned = line.strip().lower()

    return bool(
        re.fullmatch(
            r"(page\s*)?\d+",
            cleaned
        )
    )


# ============================================================
# FIND MAIN CONTENT START
# ============================================================

def find_main_content_start(text):

    # Typical headings found in your uploaded academic documents.
    patterns = [

        r"\b1\s+Introduction\b",

        r"\b1\.1\s+Project Background\b",

        r"\bChapter\s+01\s*:\s*Introduction\b",

        r"\bChapter\s+1\s*:\s*Introduction\b",

        r"\b1\s+Project Introduction\b",

        r"\b1\.1\s+Brief Idea of the Project\b",

    ]


    positions = []

    for pattern in patterns:

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

        return min(positions)


    return 0


# ============================================================
# REMOVE REFERENCES / APPENDICES
# ============================================================

def remove_end_matter(text):

    patterns = [

        r"\nReferences\b",

        r"\nBibliography\b",

        r"\nReference List\b",

        r"\nAppendix\b",

        r"\nAppendices\b",

    ]


    positions = []

    for pattern in patterns:

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

        return text[:min(positions)]


    return text


# ============================================================
# CLEAN PDF TEXT
# ============================================================

def clean_document_text(pages):

    cleaned_pages = []


    # --------------------------------------------------------
    # Detect repeated headers / footers
    # --------------------------------------------------------

    line_counts = {}

    for page_text in pages:

        seen_on_page = set()

        for raw_line in page_text.splitlines():

            line = normalize_line(
                raw_line
            )

            if not line:
                continue

            if len(line) > 150:
                continue

            if line in seen_on_page:
                continue

            seen_on_page.add(line)

            line_counts[line] = (
                line_counts.get(line, 0) + 1
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
    # Clean each page
    # --------------------------------------------------------

    for page_text in pages:

        output_lines = []

        for raw_line in page_text.splitlines():

            line = normalize_line(
                raw_line
            )

            if not line:
                continue

            # Remove repeated headers / footers
            if line in repeated_lines:
                continue

            # Remove page numbers
            if is_page_number(line):
                continue

            output_lines.append(
                line
            )


        if output_lines:

            cleaned_pages.append(
                " ".join(
                    output_lines
                )
            )


    # --------------------------------------------------------
    # Combine pages
    # --------------------------------------------------------

    full_text = "\n".join(
        cleaned_pages
    ).strip()


    if not full_text:
        return ""


    # --------------------------------------------------------
    # Remove cover / TOC / list-of-figures front matter
    # --------------------------------------------------------

    start_position = find_main_content_start(
        full_text
    )

    if start_position > 0:

        full_text = full_text[
            start_position:
        ]


    # --------------------------------------------------------
    # Remove references / appendices
    # --------------------------------------------------------

    full_text = remove_end_matter(
        full_text
    )


    # --------------------------------------------------------
    # Final whitespace cleanup
    # --------------------------------------------------------

    full_text = re.sub(
        r"\s+",
        " ",
        full_text
    )


    return full_text.strip()


# ============================================================
# SPLIT INTO CHUNKS
# ============================================================

def split_into_chunks(text):

    # Restore paragraph-like boundaries from headings where possible.
    text = re.sub(
        r"\s+(?=\d+(?:\.\d+)*\s+[A-Z])",
        "\n",
        text
    )

    text = re.sub(
        r"\s+(?=Chapter\s+\d+)",
        "\n",
        text,
        flags=re.IGNORECASE
    )


    paragraphs = [

        paragraph.strip()

        for paragraph in text.split("\n")

        if paragraph.strip()

    ]


    chunks = []


    # --------------------------------------------------------
    # Paragraph-based chunks
    # --------------------------------------------------------

    for paragraph in paragraphs:

        words = paragraph.split()

        if not words:
            continue


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


    # --------------------------------------------------------
    # Fallback for documents without useful breaks
    # --------------------------------------------------------

    if not chunks:

        words = text.split()

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
# DOCUMENT HASH
# ============================================================

def create_document_hash(text):

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
# PROCESS ONE PDF
# ============================================================

def process_pdf(file_path):

    filename = os.path.basename(
        file_path
    )


    print()
    print("=" * 70)
    print(
        "Processing:",
        filename
    )
    print("=" * 70)


    # --------------------------------------------------------
    # Open PDF
    # --------------------------------------------------------

    document = pymupdf.open(
        file_path
    )


    pages = []


    for page in document:

        text = page.get_text(
            "text"
        )

        pages.append(
            text
        )


    document.close()


    # --------------------------------------------------------
    # Clean
    # --------------------------------------------------------

    cleaned_text = clean_document_text(
        pages
    )


    if not cleaned_text:

        print(
            "WARNING: No usable text found."
        )

        return


    # --------------------------------------------------------
    # Hash
    # --------------------------------------------------------

    document_hash = create_document_hash(
        cleaned_text
    )


    # --------------------------------------------------------
    # Skip exact duplicate
    # --------------------------------------------------------

    existing_source = (
        sources_collection.find_one(
            {
                "document_hash":
                    document_hash
            }
        )
    )


    if existing_source:

        print(
            "Skipped duplicate:"
            f" {filename}"
        )

        return


    # --------------------------------------------------------
    # Metadata
    # --------------------------------------------------------

    document_type = detect_document_type(
        filename
    )


    chunks = split_into_chunks(
        cleaned_text
    )


    if not chunks:

        print(
            "WARNING: No usable chunks found."
        )

        return


    # --------------------------------------------------------
    # Save source document
    # --------------------------------------------------------

    source_document = {

        "filename":
            filename,

        "document_type":
            document_type,

        "document_hash":
            document_hash,

        "page_count":
            len(pages),

        "chunk_count":
            len(chunks),

        "created_at":
            datetime.now(
                timezone.utc
            ),

    }


    source_result = (
        sources_collection.insert_one(
            source_document
        )
    )


    source_id = (
        source_result.inserted_id
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
                    filename,

                "document_type":
                    document_type,

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


    if chunk_documents:

        chunks_collection.insert_many(
            chunk_documents
        )


    print()
    print(
        "SUCCESS"
    )

    print(
        "Document:",
        filename
    )

    print(
        "Type:",
        document_type
    )

    print(
        "Pages:",
        len(pages)
    )

    print(
        "Chunks:",
        len(chunks)
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 70)
    print(
        "ResearchSync AI - "
        "Plagiarism Reference Corpus Builder"
    )
    print("=" * 70)


    if not os.path.exists(
        REFERENCE_FOLDER
    ):

        print()
        print(
            f"ERROR: Folder '{REFERENCE_FOLDER}' "
            "does not exist."
        )

        return


    pdf_files = [

        filename

        for filename in os.listdir(
            REFERENCE_FOLDER
        )

        if filename.lower().endswith(
            ".pdf"
        )

    ]


    if not pdf_files:

        print(
            "ERROR: No PDF files found."
        )

        return


    print()
    print(
        f"Found {len(pdf_files)} PDF files."
    )


    # ========================================================
    # IMPORTANT:
    # Rebuild the corpus from scratch so the new cleaning rules
    # are applied to all documents.
    # ========================================================

    print()
    print(
        "Clearing old plagiarism corpus..."
    )


    chunks_collection.delete_many({})
    sources_collection.delete_many({})


    print(
        "Old corpus cleared."
    )


    # --------------------------------------------------------
    # Process documents
    # --------------------------------------------------------

    for filename in sorted(
        pdf_files
    ):

        file_path = os.path.join(
            REFERENCE_FOLDER,
            filename
        )


        try:

            process_pdf(
                file_path
            )

        except Exception as error:

            print()
            print(
                f"ERROR processing {filename}:"
            )

            print(
                error
            )


    # --------------------------------------------------------
    # Final count
    # --------------------------------------------------------

    source_count = (
        sources_collection.count_documents({})
    )

    chunk_count = (
        chunks_collection.count_documents({})
    )


    print()
    print("=" * 70)
    print(
        "CORPUS BUILD COMPLETE"
    )
    print("=" * 70)

    print(
        "Reference documents:",
        source_count
    )

    print(
        "Reference chunks:",
        chunk_count
    )

    print(
        "=" * 70
    )


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    main()