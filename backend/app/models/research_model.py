from datetime import datetime


def create_research_document(data, student_id):

    return {
        "student_id": student_id,

        "research_title": data.research_title,

        "research_description": data.research_description,

        "problem_statement": data.problem_statement,

        "proposed_solution": data.proposed_solution,

        "research_objectives": data.research_objectives,

        "keywords": data.keywords,

        "status": "Submitted",

        "domain": None,

        # Sentence-BERT embedding
        "embedding": None,

        # Topic Similarity
        "similarity_score": None,

        # Future Module
        "plagiarism_score": None,

        # Supervisor Recommendation
        "supervision": {
        "status": "Pending",
        "supervisor_email": None,
        "supervisor_name": None,
        "accepted_at": None,
        },

        "created_at": datetime.utcnow(),

        "updated_at": datetime.utcnow(),
    }