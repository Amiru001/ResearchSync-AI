from pathlib import Path

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

AI_DIR = BASE_DIR / "ai"

CSV_PATH = AI_DIR / "supervisors_dataset_research_domains_standardized.csv"

OUTPUT_PATH = AI_DIR / "supervisor_embeddings.npy"

# --------------------------------------------------
# Load Dataset
# --------------------------------------------------

df = pd.read_csv(CSV_PATH)

df["combined_text"] = (
    df["research_domains"]
    + " "
    + df["expertise"]
    + " "
    + df["research_interests"]
)

# --------------------------------------------------
# Load Embedding Model
# --------------------------------------------------

print("Loading Sentence Transformer...")

model = SentenceTransformer("BAAI/bge-large-en-v1.5")

# --------------------------------------------------
# Generate Embeddings
# --------------------------------------------------

print("Generating embeddings...")

embeddings = model.encode(
    df["combined_text"].tolist(),
    normalize_embeddings=True,
    show_progress_bar=True,
)

# --------------------------------------------------
# Save
# --------------------------------------------------

np.save(OUTPUT_PATH, embeddings)

print("\nDone!")
print(f"Saved to: {OUTPUT_PATH}")
print(f"Embedding shape: {embeddings.shape}")