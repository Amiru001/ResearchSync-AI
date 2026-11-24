from pymongo import DESCENDING

from app.config.database import db
from app.models.research_model import create_research_document
from app.services.domain_classifier import classify_research
from app.services.supervisor_recommender import recommend_supervisors

from app.services.topic_similarity import (
    generate_embedding,
    find_most_similar,
)


research_collection = db["research_ideas"]


def submit_research(data, student_id):

    # ------------------------------------
    # AI Domain Classification
    # ------------------------------------

    ai_result = classify_research(data)

    # ------------------------------------
    # Create MongoDB Document
    # ------------------------------------

    research = create_research_document(
        data,
        student_id,
    )

    # ------------------------------------
    # Save AI Results
    # ------------------------------------

    research["domain"] = {
        "primary_domain": ai_result["primary_domain"],
        "confidence": ai_result["confidence"],
        "all_domains": ai_result["all_domains"],
    }

    # ------------------------------------
    # Generate Sentence-BERT Embedding
    # ------------------------------------

    embedding = generate_embedding(data)

    research["embedding"] = embedding.tolist()

    # ------------------------------------
    # Load Previous Proposals (Same Domain)
    # ------------------------------------

    previous_proposals = list(
        research_collection.find(
            {
                "domain.primary_domain": ai_result["primary_domain"],
                "embedding": {"$exists": True},
            },
            {
                "_id": 0,
                "research_title": 1,
                "embedding": 1,
            },
        )
    )

    print(f"Found {len(previous_proposals)} previous proposals.")

    # ------------------------------------
    # Topic Similarity
    # ------------------------------------

    if previous_proposals:

        similarity, best_match = find_most_similar(
        embedding,
        previous_proposals,
        )

        research["similarity_score"] = {
        "status": "Completed",
        "similarity_percentage": similarity,
        "matched_title": best_match["research_title"],
        "message": "Most similar research proposal found successfully.",
    }

        print(f"Highest Similarity: {similarity}%")
        print(f"Matched Proposal: {best_match['research_title']}")

    else:

        research["similarity_score"] = {
        "status": "Completed",
        "similarity_percentage": 0,
        "matched_title": None,
        "message": "No similar research proposals found.",
    }

    print("No previous proposals found.")

    # ------------------------------------
    # Supervisor Recommendation
    # ------------------------------------

    recommendation_result = recommend_supervisors(data)

    research["recommended_supervisor"] = {
        "status": "Completed",
        "predicted_domain": recommendation_result["predicted_domain"],
        "top_supervisors": recommendation_result["recommendations"],
    }

    # ------------------------------------
    # Future AI Modules
    # ------------------------------------

    research["plagiarism_score"] = None

    # ------------------------------------
    # Save MongoDB
    # ------------------------------------

    result = research_collection.insert_one(research)

    return {
        "message": "Research idea submitted successfully.",
        "research_id": str(result.inserted_id),
        "domain": research["domain"],
        "similarity_score": research["similarity_score"],
        "recommended_supervisor": research["recommended_supervisor"],
    }


from pymongo import DESCENDING

def get_latest_research(student_id):

    print("Searching student:", student_id)

    research = research_collection.find_one(
        {"student_id": student_id},
        sort=[("created_at", DESCENDING)],
    )

    print("Mongo Result:", research)

    if research is None:
        return {
            "message": "No research found."
        }

    research["_id"] = str(research["_id"])

    return research