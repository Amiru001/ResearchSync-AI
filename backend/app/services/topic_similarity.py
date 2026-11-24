from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from app.utils.text_builder import build_research_text


# ----------------------------------
# Load Sentence-BERT Model
# ----------------------------------

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

embedding_model = SentenceTransformer(MODEL_NAME)


# ----------------------------------
# Generate Embedding
# ----------------------------------

def generate_embedding(data):

    text = build_research_text(data)

    return embedding_model.encode(
        text,
        convert_to_numpy=True,
        normalize_embeddings=True,
    )


# ----------------------------------
# Compare Two Embeddings
# ----------------------------------

def compare_embeddings(
    embedding1,
    embedding2,
):

    similarity = cosine_similarity(
        [embedding1],
        [embedding2],
    )[0][0]

    return round(float(similarity * 100), 2)


# ----------------------------------
# Find Most Similar Proposal
# ----------------------------------

def find_most_similar(
    new_embedding,
    previous_proposals,
):

    highest_similarity = 0

    best_match = None

    for proposal in previous_proposals:

        similarity = compare_embeddings(
            new_embedding,
            proposal["embedding"],
        )

        if similarity > highest_similarity:

            highest_similarity = similarity

            best_match = proposal

    return highest_similarity, best_match