from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

from app.config.database import db

from app.services.supervisor_service import (
    get_recommended_research_ideas,
    get_research_idea_details,
    accept_research_proposal,
    reject_research_proposal,
    get_my_supervisions,
    get_my_supervision_details,
    update_my_supervision_details,
    get_supervisor_dashboard,
    send_supervisor_message,
)

from app.utils.auth_dependency import (
    require_role,
)


router = APIRouter(
    prefix="/api/supervisor",
    tags=["Supervisor"]
)


# ============================================================
# DATABASE
# ============================================================

users_collection = db["users"]


# ============================================================
# UPDATE SUPERVISION REQUEST
# ============================================================

class UpdateSupervisionRequest(BaseModel):

    title: Optional[str] = None

    description: Optional[str] = None

    problemStatement: Optional[str] = None

    objectives: Optional[List[str]] = None


# ============================================================
# SEND MESSAGE REQUEST MODEL
# ============================================================

class SendSupervisorMessageRequest(BaseModel):

    message: str

    recipientType: str


# ============================================================
# GET LOGGED-IN SUPERVISOR DETAILS
# ============================================================

def get_supervisor_details(current_user):

    supervisor = users_collection.find_one(
        {
            "email": current_user["email"]
        }
    )

    if supervisor is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supervisor account not found."
        )


    if supervisor.get("role") != "supervisor":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a supervisor."
        )


    supervisor_name = supervisor.get(
        "full_name"
    )

    supervisor_email = supervisor.get(
        "email"
    )


    if not supervisor_name or not supervisor_email:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supervisor information is incomplete."
        )


    return supervisor_name, supervisor_email


# ============================================================
# GET ALL RECOMMENDED RESEARCH IDEAS
# ============================================================

@router.get("/recommendations")
def get_recommendations(
    current_user=Depends(
        require_role("supervisor")
    ),
):

    supervisor_name, supervisor_email = (
        get_supervisor_details(
            current_user
        )
    )

    return get_recommended_research_ideas(
        supervisor_name,
        supervisor_email,
    )


# ============================================================
# GET ONE RESEARCH PROPOSAL DETAILS
# ============================================================

@router.get("/recommendations/{research_id}")
def get_recommendation_details(
    research_id: str,

    current_user=Depends(
        require_role("supervisor")
    ),
):

    # Verify logged-in supervisor

    get_supervisor_details(
        current_user
    )

    return get_research_idea_details(
        research_id
    )


# ============================================================
# ACCEPT RESEARCH PROPOSAL
# ============================================================

@router.post("/recommendations/{research_id}/accept")
def accept_proposal(
    research_id: str,

    comment: str = "",

    current_user=Depends(
        require_role("supervisor")
    ),
):

    # Get real supervisor from JWT

    supervisor_name, supervisor_email = (
        get_supervisor_details(
            current_user
        )
    )


    return accept_research_proposal(

        research_id,

        supervisor_name,

        supervisor_email,

        comment,
    )


# ============================================================
# REJECT RESEARCH PROPOSAL
# ============================================================

@router.post("/recommendations/{research_id}/reject")
def reject_proposal(
    research_id: str,

    reason: str = "",

    current_user=Depends(
        require_role("supervisor")
    ),
):

    # Get real supervisor from JWT

    supervisor_name, supervisor_email = (
        get_supervisor_details(
            current_user
        )
    )


    return reject_research_proposal(

        research_id,

        supervisor_name,

        supervisor_email,

        reason,
    )


# ============================================================
# GET MY SUPERVISIONS
# ============================================================

@router.get("/supervisions")
def get_supervisions(
    current_user=Depends(
        require_role("supervisor")
    ),
):

    # Get real supervisor from JWT

    supervisor_name, supervisor_email = (
        get_supervisor_details(
            current_user
        )
    )


    return get_my_supervisions(

        supervisor_name,

        supervisor_email,
    )


# ============================================================
# GET ONE MY SUPERVISION DETAILS
# ============================================================

@router.get("/supervisions/{research_id}")
def get_my_supervision_details_route(
    research_id: str,

    current_user=Depends(
        require_role("supervisor")
    ),
):

    # Get real supervisor from JWT

    supervisor_name, supervisor_email = (
        get_supervisor_details(
            current_user
        )
    )


    return get_my_supervision_details(

        research_id,

        supervisor_name,

        supervisor_email,
    )


# ============================================================
# UPDATE MY SUPERVISION DETAILS
# ============================================================

@router.put("/supervisions/{research_id}")
def update_my_supervision_details_route(
    research_id: str,

    request: UpdateSupervisionRequest,

    current_user=Depends(
        require_role("supervisor")
    ),
):

    # Get real supervisor from JWT

    supervisor_name, supervisor_email = (
        get_supervisor_details(
            current_user
        )
    )


    return update_my_supervision_details(

        research_id,

        supervisor_name,

        supervisor_email,

        request.title,

        request.description,

        request.problemStatement,

        request.objectives,
    )


# ============================================================
# GET SUPERVISOR DASHBOARD
# ============================================================

@router.get("/dashboard")
def get_dashboard(
    current_user=Depends(
        require_role("supervisor")
    ),
):

    # Get real supervisor from JWT

    supervisor_name, supervisor_email = (
        get_supervisor_details(
            current_user
        )
    )


    return get_supervisor_dashboard(

        supervisor_name,

        supervisor_email,
    )


# ============================================================
# SEND MESSAGE TO STUDENT / ALL STUDENTS
# ============================================================

@router.post("/messages")
def send_message(
    research_id: str,

    request: SendSupervisorMessageRequest,

    current_user=Depends(
        require_role("supervisor")
    ),
):

    # Get real supervisor from JWT

    supervisor_name, supervisor_email = (
        get_supervisor_details(
            current_user
        )
    )


    return send_supervisor_message(

        research_id,

        supervisor_name,

        supervisor_email,

        request.message,

        request.recipientType,
    )