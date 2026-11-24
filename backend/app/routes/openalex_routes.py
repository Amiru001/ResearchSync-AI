import requests
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.utils.auth_dependency import require_role
from app.services.openalex_service import (
    search_external_sources,
)


router = APIRouter(
    prefix="/api/plagiarism",
    tags=["Plagiarism"],
)


class ExternalSearchRequest(BaseModel):

    text: str


@router.post("/external-search")
def external_search(

    request: ExternalSearchRequest,

    current_user=Depends(
        require_role("student")
    ),

):

    try:

        return search_external_sources(
            request.text
        )

    except requests.exceptions.RequestException:

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to reach the "
                "OpenAlex scholarly service."
            ),
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )