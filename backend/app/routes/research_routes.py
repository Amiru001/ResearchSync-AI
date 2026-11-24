from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.research_schema import ResearchCreate

from app.services.research_service import (
    submit_research,
    get_latest_research,
)

from app.services.supervisor_service import (
    get_student_supervisor_messages,
)

from app.config.database import db

from app.utils.auth_dependency import (
    get_current_user,
    require_role,
)


router = APIRouter(
    prefix="/api/research",
    tags=["Research"]
)


users_collection = db["users"]


# ============================================================
# GET LOGGED-IN STUDENT
# ============================================================

def get_student_registration(current_user):

    student = users_collection.find_one(
        {
            "email": current_user["email"]
        }
    )

    if student is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student account not found."
        )

    registration_number = student.get(
        "registration_number"
    )

    if not registration_number:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student registration number not found."
        )

    return registration_number


# ============================================================
# SUBMIT RESEARCH
# ============================================================

@router.post("/submit")
def submit(
    data: ResearchCreate,
    current_user=Depends(
        require_role("student")
    ),
):

    # Get the real logged-in student's
    # registration number from JWT email.

    student_id = get_student_registration(
        current_user
    )

    return submit_research(
        data,
        student_id,
    )


# ============================================================
# GET LATEST RESEARCH
# ============================================================

@router.get("/latest")
def latest(
    current_user=Depends(
        require_role("student")
    ),
):

    # Get the real logged-in student's
    # registration number.

    student_id = get_student_registration(
        current_user
    )

    return get_latest_research(
        student_id
    )


# ============================================================
# GET SUPERVISOR MESSAGES
# ============================================================

@router.get("/supervisor-messages")
def supervisor_messages(
    current_user=Depends(
        require_role("student")
    ),
):

    # Get the real logged-in student's
    # registration number.

    student_id = get_student_registration(
        current_user
    )

    return get_student_supervisor_messages(
        student_id
    )