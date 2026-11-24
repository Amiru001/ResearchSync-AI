
# ResearchSync AI
**BERT-based Framework for Research Topic Classification, Plagiarism Detection, and Optimized Supervisor Recommendation**

ResearchSync AI is a full-stack web-based research decision-support system developed to support university research proposal analysis and supervisor recommendation.

The system integrates machine learning, natural language processing (NLP), semantic similarity analysis, plagiarism screening, scholarly source discovery, and supervisor recommendation into a single application.

The platform provides separate interfaces for Students, Supervisors, and Administrators.

## Key Features

### 1. Research Topic Classification
- Classifies research proposals into five research domains:
  - Artificial Intelligence
  - Cybersecurity
  - Data Science
  - Networking
  - Software Engineering
- Uses a fine-tuned BERT sequence-classification model.
- Displays predicted research domains with percentage-based confidence scores.

### 2. Semantic Similarity Analysis
- Identifies similar research topics even when different wording is used.
- Uses Sentence-BERT embeddings and cosine similarity.
- Helps identify related or overlapping research proposals.

### 3. Plagiarism Similarity Screening
- Implements a hybrid similarity-screening approach using TF-IDF and semantic similarity.
- Compares submitted research text against an available reference corpus.
- Displays similarity scores, matching references, and risk levels.
- Provides supporting information for academic review.

### 4. Supervisor Recommendation
- Recommends and ranks supervisors based on three matching factors:
  - Semantic Similarity – 40%
  - Research Domain Matching – 40%
  - Keyword Matching – 20%
- Uses text embeddings to compare student research proposals with supervisor research profiles.
- Provides matching scores and supporting explanations.

### 5. Scholarly Source Discovery
- Integrates the OpenAlex API.
- Retrieves potentially relevant academic publications.
- Provides additional scholarly source information related to submitted research topics.

### 6. Role-Based User Management
- Student registration and authentication.
- Supervisor account management.
- Administrator dashboard.
- JWT-based authentication.
- Role-based access control.
- Student–Supervisor communication and supervision management.

## Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Tailwind CSS
- Vite
- Axios
- React Router

### Backend
- Python
- FastAPI
- REST APIs

### Database
- MongoDB
- PyMongo

### Machine Learning and NLP
- PyTorch
- Hugging Face Transformers
- BERT
- Sentence Transformers
- Scikit-learn
- TF-IDF
- Cosine Similarity
- Pandas
- NumPy
- Joblib

### External Integration
- OpenAlex API

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Google Colab

## Machine Learning Evaluation

The research-topic classification component was developed using a labelled dataset containing 2,000 research-topic records across five research domains.

Three classification approaches were evaluated using the same dataset.

| Model | Accuracy |
|---|---:|
| Support Vector Machine (SVM) | 99.33% |
| Gated Recurrent Unit (GRU) | 93.67% |
| BERT | 99.67% |

The final BERT model achieved:

- Accuracy: 99.67%
- Precision: 99.67%
- Recall: 99.67%
- F1-Score: 99.67%

Evaluation was performed using a held-out test dataset of 300 records.

## System Architecture

The application follows a layered architecture in which the frontend communicates with the backend through REST APIs.

```text
                 React Frontend
                       |
                       v
                 FastAPI Backend
                       |
          +------------+-------------+
          |            |             |
          v            v             v
      MongoDB     AI Services    OpenAlex API
                      |
             +--------+---------+
             |        |         |
             v        v         v
           BERT   Semantic   Supervisor
                  Analysis  Recommendation
```

## User Roles

### Student
- Register and log in.
- Submit research proposals.
- View research-domain classification results.
- Check topic similarity.
- Perform plagiarism similarity checks.
- View recommended supervisors.
- Communicate with supervisors.

### Supervisor
- Access the supervisor dashboard.
- Review recommended research proposals.
- View proposal and matching information.
- Accept or reject supervision requests.
- Manage accepted supervisions.
- Communicate with students.

### Administrator
- Access the administrator dashboard.
- Create supervisor accounts.
- View registered supervisor accounts.
- Manage authorized supervisor profiles.

## Project Structure

```text
ResearchSync-AI/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── ai/
│   │   ├── research_topic_classifier/
│   │   └── label_encoder.pkl
│   │
│   ├── app/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js and npm
- Python
- MongoDB database
- OpenAlex API key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ResearchSync-AI
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start using Vite.

### 3. Backend Setup

Open another terminal:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

Windows:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Create your local environment file using `.env.example` as a reference.

Configure your MongoDB connection, database name, JWT secret, and OpenAlex API key.

### 4. Start the Backend

From the backend directory:

```bash
uvicorn main:app --reload
```

The FastAPI API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## Model and Data Requirements

The trained BERT model weights and private reference documents are not included in this repository.

The BERT model weights must be provided separately under:

```text
backend/ai/research_topic_classifier/
```

The supervisor recommendation component also requires an approved, anonymized supervisor dataset and corresponding embeddings.

The original academic reference documents and private supervisor information are intentionally excluded from the public repository.

## Testing and Evaluation

The completed application was evaluated through:

- Machine learning model performance evaluation.
- Semantic similarity test scenarios.
- Plagiarism similarity screening test cases.
- Supervisor recommendation scenarios.
- Functional testing.
- API and integration verification.
- Authentication and role-based access verification.

A total of 20 functional test cases were manually executed, and all evaluated scenarios produced the expected behaviour.

## Limitations

- Research-topic classification is limited to five predefined research domains.
- Classification performance depends on the available training dataset.
- Plagiarism screening is limited to the available reference corpus and external scholarly sources.
- Similarity scores are supporting evidence and do not independently prove plagiarism.
- Supervisor recommendations support academic decisions; final allocation remains under human judgement.

## Author

**Amiru Pinsara**

BSc (Hons) in Software Engineering  
SLIIT City University

---

Developed as an Individual Final-Year Research Project (2025/2026).
