from typing import List, Dict, Any

import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.config.database import db
from app.services.topic_similarity import embedding_model


# ============================================================
# DATABASE
# ============================================================

plagiarism_chunks_collection = (
    db["plagiarism_chunks"]
)


# ============================================================
# SETTINGS
# ============================================================

TFIDF_TOP_K = 5

SEMANTIC_MEDIUM_THRESHOLD = 0.50
SEMANTIC_HIGH_THRESHOLD = 0.75

TFIDF_SUPPORT_THRESHOLD = 0.20


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(text: str) -> str:

    if not text:

        return ""

    return " ".join(
        str(text).split()
    ).strip()


# ============================================================
# SPLIT STUDENT DOCUMENT
# ============================================================

def split_text_into_chunks(
    text: str,
    min_words: int = 60,
    max_words: int = 180,
) -> List[str]:

    if not text:
        return []

    # --------------------------------------------------------
    # Preserve paragraph boundaries first
    # --------------------------------------------------------

    paragraphs = re_split_paragraphs(text)

    cleaned_paragraphs = []

    for paragraph in paragraphs:

        paragraph = normalize_text(
            paragraph
        )

        if paragraph:
            cleaned_paragraphs.append(
                paragraph
            )

    if not cleaned_paragraphs:
        return []

    # --------------------------------------------------------
    # Build chunks by combining smaller paragraphs
    #
    # Important:
    # Short paragraphs are NOT discarded.
    # They are combined until a useful chunk is formed.
    # --------------------------------------------------------

    chunks = []

    current_words = []

    for paragraph in cleaned_paragraphs:

        words = paragraph.split()

        # ----------------------------------------------------
        # If adding this paragraph would make the chunk too
        # large, save the current chunk first.
        # ----------------------------------------------------

        if (
            current_words
            and
            len(current_words) + len(words)
            > max_words
        ):

            if len(current_words) >= min_words:

                chunks.append(
                    " ".join(current_words)
                )

            current_words = []


        # ----------------------------------------------------
        # Add paragraph
        # ----------------------------------------------------

        current_words.extend(words)


        # ----------------------------------------------------
        # Once the chunk reaches the minimum size, keep it
        # unless the next paragraph can still reasonably fit.
        # ----------------------------------------------------

        if len(current_words) >= max_words:

            chunks.append(
                " ".join(current_words)
            )

            current_words = []


    # --------------------------------------------------------
    # Save remaining words
    # --------------------------------------------------------

    if current_words:

        # Keep the final chunk even when it is shorter than
        # the minimum. We don't want to lose student content.

        chunks.append(
            " ".join(current_words)
        )

    return chunks


# ============================================================
# PARAGRAPH SPLITTER
# ============================================================

def re_split_paragraphs(text: str) -> List[str]:

    if not text:

        return []


    # Normalize Windows line endings
    text = text.replace(
        "\r\n",
        "\n"
    )

    text = text.replace(
        "\r",
        "\n"
    )


    # Split on blank lines
    paragraphs = []

    for block in text.split(
        "\n\n"
    ):

        block = block.strip()

        if block:

            paragraphs.append(
                block
            )


    # If PDF/web text has no blank lines,
    # preserve the entire text as one block.
    if not paragraphs:

        paragraphs = [
            text
        ]


    return paragraphs


# ============================================================
# LOAD REFERENCE CHUNKS
# ============================================================

def load_reference_chunks():

    return list(
        plagiarism_chunks_collection.find(
            {},
            {
                "_id": 1,
                "source_id": 1,
                "filename": 1,
                "document_type": 1,
                "chunk_index": 1,
                "word_count": 1,
                "text": 1,
                "embedding": 1,
            },
        )
    )


# ============================================================
# TF-IDF CANDIDATE SEARCH
# ============================================================

def find_tfidf_candidates(
    student_chunk: str,
    reference_chunks: List[Dict[str, Any]],
    top_k: int = TFIDF_TOP_K,
):

    if not reference_chunks:

        return []


    reference_texts = [

        normalize_text(
            chunk.get(
                "text",
                ""
            )
        )

        for chunk in reference_chunks

    ]


    documents = [
        student_chunk
    ] + reference_texts


    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        min_df=1,
    )


    try:

        matrix = vectorizer.fit_transform(
            documents
        )

    except ValueError:

        return []


    student_vector = matrix[0]

    reference_vectors = matrix[1:]


    similarities = cosine_similarity(
        student_vector,
        reference_vectors,
    )[0]


    top_indices = np.argsort(
        similarities
    )[::-1][
        :top_k
    ]


    candidates = []


    for index in top_indices:

        candidates.append(
            {
                "reference":
                    reference_chunks[index],

                "tfidf_score":
                    float(
                        similarities[index]
                    ),
            }
        )


    return candidates


# ============================================================
# STORED SBERT SIMILARITY
# ============================================================

def calculate_stored_embedding_similarity(
    student_embedding,
    reference_embedding,
) -> float:

    if (
        student_embedding is None
        or reference_embedding is None
    ):

        return 0.0


    student_vector = np.asarray(
        student_embedding,
        dtype=np.float32,
    )


    reference_vector = np.asarray(
        reference_embedding,
        dtype=np.float32,
    )


    student_norm = np.linalg.norm(
        student_vector
    )

    reference_norm = np.linalg.norm(
        reference_vector
    )


    if (
        student_norm == 0
        or reference_norm == 0
    ):

        return 0.0


    student_vector = (
        student_vector /
        student_norm
    )

    reference_vector = (
        reference_vector /
        reference_norm
    )


    similarity = float(
        np.dot(
            student_vector,
            reference_vector,
        )
    )


    return max(
        0.0,
        min(
            1.0,
            similarity
        )
    )


# ============================================================
# RISK LEVEL
# ============================================================

def get_risk_level(
    similarity_percentage: float,
) -> str:

    if similarity_percentage >= 75:

        return "High"


    if similarity_percentage >= 50:

        return "Medium"


    return "Low"


# ============================================================
# RISK MESSAGE
# ============================================================

def get_risk_message(
    risk_level: str,
) -> str:

    if risk_level == "High":

        return (
            "High similarity was found with "
            "the available reference documents. "
            "Academic review is recommended."
        )


    if risk_level == "Medium":

        return (
            "Moderate similarity was found with "
            "the available reference documents. "
            "The matching sections should be reviewed."
        )


    return (
        "Low similarity was found with the "
        "available reference documents."
    )


# ============================================================
# ANALYSE ONE STUDENT CHUNK
# ============================================================

def analyse_student_chunk(
    student_chunk: str,
    reference_chunks: List[Dict[str, Any]],
):

    candidates = find_tfidf_candidates(
        student_chunk,
        reference_chunks,
        TFIDF_TOP_K,
    )


    if not candidates:

        return None


    # --------------------------------------------------------
    # Student embedding once
    # --------------------------------------------------------

    student_embedding = (
        embedding_model.encode(
            student_chunk,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )
    )


    best_result = None


    # --------------------------------------------------------
    # Compare candidate references
    # --------------------------------------------------------

    for candidate in candidates:

        reference = candidate[
            "reference"
        ]


        reference_embedding = (
            reference.get(
                "embedding"
            )
        )


        semantic_score = (
            calculate_stored_embedding_similarity(
                student_embedding,
                reference_embedding,
            )
        )


        tfidf_score = candidate[
            "tfidf_score"
        ]


        # ----------------------------------------------------
        # Combined evidence
        #
        # Semantic similarity gets greater weight because
        # paraphrased text can use different words.
        # ----------------------------------------------------

        combined_score = (
            semantic_score * 0.70
            +
            tfidf_score * 0.30
        )


        result = {

            "student_text":
                student_chunk,

            "student_word_count":
                len(
                    student_chunk.split()
                ),

            "tfidf_score":
                round(
                    tfidf_score * 100,
                    2,
                ),

            "semantic_score":
                round(
                    semantic_score * 100,
                    2,
                ),

            "combined_score":
                round(
                    combined_score * 100,
                    2,
                ),

            "matched_reference": {

                "id":
                    str(
                        reference.get(
                            "_id"
                        )
                    ),

                "source_id":
                    (
                        str(
                            reference.get(
                                "source_id"
                            )
                        )
                        if reference.get(
                            "source_id"
                        )
                        else None
                    ),

                "filename":
                    reference.get(
                        "filename"
                    ),

                "document_type":
                    reference.get(
                        "document_type"
                    ),

                "chunk_index":
                    reference.get(
                        "chunk_index"
                    ),

                "word_count":
                    reference.get(
                        "word_count"
                    ),

                "text":
                    reference.get(
                        "text"
                    ),

            },

        }


        if (
            best_result is None
            or
            result["combined_score"]
            >
            best_result[
                "combined_score"
            ]
        ):

            best_result = result


    return best_result


# ============================================================
# MAIN PLAGIARISM CHECK
# ============================================================

def check_plagiarism(
    document_text: str,
) -> Dict[str, Any]:

    document_text = (
        document_text.strip()
        if document_text
        else ""
    )


    if not document_text:

        return {
            "status": "Failed",
            "message":
                "Document text cannot be empty.",
        }


    # --------------------------------------------------------
    # Split student document
    # --------------------------------------------------------

    student_chunks = (
        split_text_into_chunks(
            document_text
        )
    )


    if not student_chunks:

        return {
            "status": "Failed",
            "message":
                "Please provide a longer document for plagiarism screening.",
        }


    # --------------------------------------------------------
    # Reference corpus
    # --------------------------------------------------------

    reference_chunks = (
        load_reference_chunks()
    )


    if not reference_chunks:

        return {
            "status": "Failed",
            "message":
                "No reference documents are available for comparison.",
        }


    # --------------------------------------------------------
    # Analyse every student chunk
    # --------------------------------------------------------

    chunk_results = []


    for index, student_chunk in enumerate(
        student_chunks
    ):

        result = analyse_student_chunk(
            student_chunk,
            reference_chunks,
        )


        if result is None:

            continue


        result[
            "student_chunk_index"
        ] = index


        chunk_results.append(
            result
        )


    if not chunk_results:

        return {
            "status": "Completed",
            "similarity_percentage": 0.0,
            "risk_level": "Low",
            "highest_similarity": 0.0,
            "similarity_coverage": 0.0,
            "student_chunk_count":
                len(student_chunks),
            "reference_chunk_count":
                len(reference_chunks),
            "matched_documents": [],
            "matching_sections": [],
            "message":
                "No meaningful similarity was found.",
        }


    # --------------------------------------------------------
    # Calculate weighted average
    #
    # THIS is the important fix.
    #
    # We no longer calculate:
    #
    # highest score + artificial coverage score
    #
    # Instead we calculate the average similarity of all
    # submitted chunks, weighted by their word count.
    # --------------------------------------------------------

    total_words = sum(
        result[
            "student_word_count"
        ]
        for result in chunk_results
    )


    if total_words == 0:

        final_score = 0.0

    else:

        weighted_score = sum(

            (
                result[
                    "combined_score"
                ]
                *
                result[
                    "student_word_count"
                ]
            )

            for result in chunk_results

        ) / total_words


        final_score = round(
            weighted_score,
            2
        )


    # --------------------------------------------------------
    # Highest matching section
    # --------------------------------------------------------

    highest_similarity = round(
        max(
            result[
                "combined_score"
            ]
            for result in chunk_results
        ),
        2
    )


    # --------------------------------------------------------
    # Similarity coverage
    #
    # Percentage of submitted words that belong to chunks
    # having at least moderate semantic similarity.
    # --------------------------------------------------------

    meaningful_word_count = sum(

        result[
            "student_word_count"
        ]

        for result in chunk_results

        if result[
            "semantic_score"
        ]
        >=
        SEMANTIC_MEDIUM_THRESHOLD * 100

    )


    similarity_coverage = round(

        (
            meaningful_word_count
            /
            total_words
        ) * 100

        if total_words > 0
        else 0.0,

        2

    )


    # --------------------------------------------------------
    # Risk
    # --------------------------------------------------------

    risk_level = get_risk_level(
        final_score
    )


    # --------------------------------------------------------
    # Top matching documents
    # --------------------------------------------------------

    chunk_results.sort(
        key=lambda item:
            item[
                "combined_score"
            ],
        reverse=True,
    )


    matching_documents = []

    seen_documents = set()


    for result in chunk_results:

        reference = (
            result[
                "matched_reference"
            ]
        )


        filename = reference[
            "filename"
        ]


        if filename in seen_documents:

            continue


        seen_documents.add(
            filename
        )


        matching_documents.append(
            {

                "filename":
                    filename,

                "document_type":
                    reference[
                        "document_type"
                    ],

                "similarity":
                    result[
                        "combined_score"
                    ],

            }
        )


        if len(
            matching_documents
        ) >= 5:

            break


    # --------------------------------------------------------
    # Matching sections
    # --------------------------------------------------------

    matching_sections = []


    for result in chunk_results:

        if (
            result[
                "semantic_score"
            ]
            <
            SEMANTIC_MEDIUM_THRESHOLD * 100
        ):

            continue


        reference = (
            result[
                "matched_reference"
            ]
        )


        matching_sections.append(
            {

                "student_chunk_index":
                    result[
                        "student_chunk_index"
                    ],

                "student_text":
                    result[
                        "student_text"
                    ],

                "reference_document":
                    reference[
                        "filename"
                    ],

                "reference_chunk_index":
                    reference[
                        "chunk_index"
                    ],

                "reference_text":
                    reference[
                        "text"
                    ],

                "tfidf_similarity":
                    result[
                        "tfidf_score"
                    ],

                "semantic_similarity":
                    result[
                        "semantic_score"
                    ],

                "combined_similarity":
                    result[
                        "combined_score"
                    ],

            }
        )


        if len(
            matching_sections
        ) >= 10:

            break


    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {

        "status":
            "Completed",

        "similarity_percentage":
            final_score,

        "risk_level":
            risk_level,

        "highest_similarity":
            highest_similarity,

        "similarity_coverage":
            similarity_coverage,

        "student_chunk_count":
            len(
                student_chunks
            ),

        "reference_chunk_count":
            len(
                reference_chunks
            ),

        "matched_documents":
            matching_documents,

        "matching_sections":
            matching_sections,

        "message":
            get_risk_message(
                risk_level
            ),

    }