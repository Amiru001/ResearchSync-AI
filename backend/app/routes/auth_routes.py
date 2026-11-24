from fastapi import APIRouter, HTTPException, status

from app.schemas.user_schema import RegisterUser
from app.schemas.login_schema import LoginUser

from app.services.auth_service import (
    register_user,
    login_user
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register(user: RegisterUser):

    result = register_user(user)

    if not result["success"]:

        if result["message"] == "Email already exists.":

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=result["message"]
            )

        if result["message"] == "Registration number already exists.":

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=result["message"]
            )

    return result


@router.post("/login")
def login(user: LoginUser):

    result = login_user(user)

    if not result["success"]:

        if result["message"] == "Invalid email or password.":

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=result["message"]
            )

        if result["message"] == "Your account has been deactivated.":

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=result["message"]
            )

    return result