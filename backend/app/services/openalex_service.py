import os
import requests

from sklearn.metrics.pairwise import cosine_similarity

from app.services.topic_similarity import embedding_model


OPENALEX_URL = "https://api.openalex.org/works"

OPENALEX_API_KEY = os.getenv(
    "OPENALEX_API_KEY"
)

MAX_RESULTS = 5


def search_external_sources(text: str):

    if not OPENALEX_API_KEY:

        raise RuntimeError(
            "OPENALEX_API_KEY is not configured."
        )

    cleaned_text = " ".join(
        text.split()
    ).strip()

    if not cleaned_text:

        return {
            "sources": [],
            "external_similarity": 0.0,
        }

    # Keep the query reasonably small.
    query = " ".join(
        cleaned_text.split()[:80]
    )

    params = {

        "search": query,

        "filter":
            "is_oa:true",

        "per-page":
            MAX_RESULTS,

        "select":
            (
                "id,"
                "display_name,"
                "publication_year,"
                "doi,"
                "primary_location,"
                "open_access,"
                "authorships,"
                "concepts,"
                "abstract_inverted_index"
            ),

        "api_key":
            OPENALEX_API_KEY,
    }

    response = requests.get(
        OPENALEX_URL,
        params=params,
        timeout=20,
    )

    response.raise_for_status()

    data = response.json()

    works = data.get(
        "results",
        []
    )

    if not works:

        return {
            "sources": [],
            "external_similarity": 0.0,
        }

    # --------------------------------------------------------
    # Submitted text embedding
    # --------------------------------------------------------

    student_embedding = (
        embedding_model.encode(
            cleaned_text,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )
    )

    sources = []

    similarity_scores = []

    for work in works:

        title = (
            work.get(
                "display_name"
            )
            or
            "Untitled work"
        )

        year = work.get(
            "publication_year"
        )

        # ----------------------------------------------------
        # Reconstruct abstract
        # ----------------------------------------------------

        inverted_index = (
            work.get(
                "abstract_inverted_index"
            )
            or {}
        )

        abstract_words = []

        for word, positions in (
            inverted_index.items()
        ):

            for position in positions:

                abstract_words.append(
                    (
                        position,
                        word
                    )
                )

        abstract_words.sort(
            key=lambda item: item[0]
        )

        abstract = " ".join(
            word
            for _, word in abstract_words
        )

        if not abstract:

            # Still show the source,
            # but don't calculate a
            # semantic score without text.
            continue

        # ----------------------------------------------------
        # Semantic similarity
        # ----------------------------------------------------

        source_embedding = (
            embedding_model.encode(
                abstract,
                convert_to_numpy=True,
                normalize_embeddings=True,
            )
        )

        similarity = (
            cosine_similarity(
                [student_embedding],
                [source_embedding]
            )[0][0]
        )

        similarity_percentage = round(
            float(similarity * 100),
            2
        )

        similarity_scores.append(
            similarity_percentage
        )

        # ----------------------------------------------------
        # Authors
        # ----------------------------------------------------

        authors = []

        for author in (
            work.get(
                "authorships"
            )
            or []
        ):

            author_name = (
                author
                .get("author", {})
                .get("display_name")
            )

            if author_name:

                authors.append(
                    author_name
                )

        # ----------------------------------------------------
        # DOI
        # ----------------------------------------------------

        doi = work.get(
            "doi"
        )

        primary_location = (
            work.get(
                "primary_location"
            )
            or {}
        )

        source_url = (
            primary_location
            .get("landing_page_url")
        )

        pdf_url = (
            primary_location
            .get("pdf_url")
        )

        # ----------------------------------------------------
        # Save result
        # ----------------------------------------------------

        sources.append(
            {
                "title":
                    title,

                "year":
                    year,

                "authors":
                    authors[:3],

                "doi":
                    doi,

                "source_url":
                    source_url,

                "pdf_url":
                    pdf_url,

                "similarity":
                    similarity_percentage,

            }
        )

    # --------------------------------------------------------
    # Sort highest similarity first
    # --------------------------------------------------------

    sources.sort(
        key=lambda item:
            item["similarity"],
        reverse=True
    )

    # Use the highest retrieved
    # scholarly similarity as the
    # external indicator.
    external_similarity = (
        max(similarity_scores)
        if similarity_scores
        else 0.0
    )

    return {
        "sources":
            sources,

        "external_similarity":
            round(
                external_similarity,
                2
            ),

        "source_count":
            len(sources),

    }