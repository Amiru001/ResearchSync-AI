from app.services.domain_classifier import classify_research

text = """
Title:
AI Based Student Performance Prediction

Description:
This research proposes a BERT based machine learning framework
to predict student academic performance using deep learning,
natural language processing and educational datasets.
"""

result = classify_research(text)

print(result)