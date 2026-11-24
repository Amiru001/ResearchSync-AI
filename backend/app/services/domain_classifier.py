from pathlib import Path
import joblib
import torch
import torch.nn.functional as F

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)

# -----------------------------
# Model Path
# -----------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "ai" / "research_topic_classifier"

LABEL_ENCODER_PATH = BASE_DIR / "ai" / "label_encoder.pkl"

# -----------------------------
# Load Model Once
# -----------------------------

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)

model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

label_encoder = joblib.load(LABEL_ENCODER_PATH)

model.eval()


def classify_research(data):

    text = (
    f"Title: {data.research_title}\n\n"
    f"Description: {data.research_description}"

)

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256,
    )

    with torch.no_grad():

        outputs = model(**inputs)

        probabilities = F.softmax(
            outputs.logits,
            dim=1
        )[0]

    scores = probabilities.cpu().numpy() * 100

    domains = []

    for label, score in zip(
        label_encoder.classes_,
        scores,
    ):
        domains.append(
            {
                "domain": label,
                "score": round(float(score), 2),
            }
        )

    domains = sorted(
        domains,
        key=lambda x: x["score"],
        reverse=True,
    )

    return {
        "primary_domain": domains[0]["domain"],
        "confidence": domains[0]["score"],
        "all_domains": domains,
    }


def get_domain_scores(data):

    result = classify_research(data)

    scores = {}

    for item in result["all_domains"]:
        scores[item["domain"]] = item["score"]

    return (
        result["primary_domain"],
        scores,
    )