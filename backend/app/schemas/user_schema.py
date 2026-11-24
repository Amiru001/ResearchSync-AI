from pydantic import BaseModel, EmailStr, Field


class RegisterUser(BaseModel):

    full_name: str = Field(
        ...,
        min_length=3,
        max_length=100
    )

    email: EmailStr

    registration_number: str = Field(
        ...,
        min_length=5,
        max_length=30
    )

    degree_programme: str = Field(
        ...,
        min_length=5,
        max_length=150
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=50
    )