from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.services.plagiarism_service import (
    check_plagiarism,
)

from app.utils.auth_dependency import require_role


router = APIRouter(
    prefix="/api/plagiarism",
    tags=["Plagiarism"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class PlagiarismCheckRequest(BaseModel):

    text: str = Field(
        ...,
        min_length=100,
        description="Research document text to analyse.",
    )


# ============================================================
# CHECK PLAGIARISM
# ============================================================

@router.post("/check")
def check_plagiarism_route(
    request: PlagiarismCheckRequest,
    current_user=Depends(
        require_role("student")
    ),
):

    result = check_plagiarism(
        request.text
    )

    return result