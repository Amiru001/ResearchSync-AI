from pathlib import Path
from app.utils.text_builder import build_research_text

import numpy as np
import pandas as pd

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from app.services.domain_classifier import get_domain_scores


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

AI_DIR = BASE_DIR / "ai"

DATASET_PATH = AI_DIR / "supervisors_dataset_research_domains_standardized.csv"

EMBEDDINGS_PATH = AI_DIR / "supervisor_embeddings.npy"


# --------------------------------------------------
# Load Dataset
# --------------------------------------------------

df = pd.read_csv(DATASET_PATH)

df["combined_text"] = (
    df["research_domains"]
    + " "
    + df["expertise"]
    + " "
    + df["research_interests"]
)



# --------------------------------------------------
# Load Sentence Transformer
# --------------------------------------------------

embedding_model = SentenceTransformer(
    "BAAI/bge-large-en-v1.5"
)


# --------------------------------------------------
# Load Precomputed Embeddings
# --------------------------------------------------

supervisor_embeddings = np.load(
    EMBEDDINGS_PATH
)


# --------------------------------------------------
# Configuration
# --------------------------------------------------

SIMILARITY_WEIGHT = 0.40
DOMAIN_WEIGHT = 0.40
KEYWORD_WEIGHT = 0.20

DOMAIN_MISMATCH_PENALTY = 0.75
MINIMUM_SCORE = 45


# --------------------------------------------------
# Keyword Matching
# --------------------------------------------------

def semantic_keyword_score(student_keywords, supervisor_keywords):

    student = {
        k.strip().lower()
        for k in student_keywords
    }

    supervisor = {
        k.strip().lower()
        for k in supervisor_keywords.split(",")
    }

    if len(student) == 0:
        return 0

    overlap = student.intersection(supervisor)

    return len(overlap) / len(student)


# --------------------------------------------------
# Recommendation Explanation
# --------------------------------------------------

def recommendation_reason(
    semantic_score,
    domain_score,
    keyword_score,
):

    reasons = []

    if semantic_score >= 80:
        reasons.append(
            "Very strong semantic similarity."
        )
    elif semantic_score >= 60:
        reasons.append(
            "Good semantic similarity."
        )

    if domain_score >= 80:
        reasons.append(
            "Excellent domain match."
        )
    elif domain_score >= 50:
        reasons.append(
            "Relevant research domain."
        )

    if keyword_score >= 0.5:
        reasons.append(
            "Several keywords matched."
        )
    elif keyword_score > 0:
        reasons.append(
            "Some keywords matched."
        )

    if not reasons:
        reasons.append(
            "Overall suitable supervisor."
        )

    return " ".join(reasons)

# --------------------------------------------------
# Supervisor Recommendation
# --------------------------------------------------

def recommend_supervisors(data, top_k=2):

    predicted_domain, domain_scores = get_domain_scores(data)

    text = build_research_text(data)

    student_embedding = embedding_model.encode(
        text,
        convert_to_numpy=True,
    )

    similarities = cosine_similarity(
        [student_embedding],
        supervisor_embeddings,
    )[0]

    recommendations = []

    for index, row in df.iterrows():

        semantic_score = similarities[index] * 100

        supervisor_domains = [
            d.strip()
            for d in row["research_domains"].split(",")
    ]

        domain_score = max(
            (
                 domain_scores.get(domain, 0)
                for domain in supervisor_domains
            ),
             default=0,
        )

        keyword_score = semantic_keyword_score(
            data.keywords,
            row["research_interests"],
        )

        overall_score = (
            semantic_score * SIMILARITY_WEIGHT
            + domain_score * DOMAIN_WEIGHT
            + keyword_score * 100 * KEYWORD_WEIGHT
        )

        if predicted_domain not in supervisor_domains:
            overall_score *= DOMAIN_MISMATCH_PENALTY
   

        if overall_score < MINIMUM_SCORE:
            continue

        recommendations.append(
    {
        "supervisor_id": int(row["supervisor_id"]),
        "supervisor_name": row["supervisor_name"],
        "research_domain": row["research_domains"],
        "expertise": row["expertise"],
        "research_interests": row["research_interests"],

        "overall_score": round(float(overall_score), 2),
        "semantic_score": round(float(semantic_score), 2),
        "domain_score": round(float(domain_score), 2),
        "keyword_score": round(float(keyword_score * 100), 2),

        "reason": recommendation_reason(
            float(semantic_score),
            float(domain_score),
            float(keyword_score),
        ),
    }
)

    clean_domain_scores = {
    domain: round(float(score), 2)
    for domain, score in domain_scores.items()
}

    recommendations.sort(
    key=lambda x: x["overall_score"],
    reverse=True
)

    return {
    "predicted_domain": predicted_domain,
    "domain_scores": clean_domain_scores,
    "recommendations": recommendations[:top_k],
}