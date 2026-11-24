from datetime import datetime

from app.config.database import db

from app.utils.password import (
    hash_password,
    verify_password
)

from app.utils.jwt_handler import create_access_token


users_collection = db["users"]


# ----------------------------
# Register User
# ----------------------------

def register_user(user):

    # Check duplicate email

    existing_email = users_collection.find_one(
        {
            "email": user.email.lower()
        }
    )

    if existing_email:

        return {
            "success": False,
            "message": "Email already exists."
        }

    # Check duplicate registration number

    existing_registration = users_collection.find_one(
        {
            "registration_number": user.registration_number.upper()
        }
    )

    if existing_registration:

        return {
            "success": False,
            "message": "Registration number already exists."
        }

    new_user = {

        "full_name": user.full_name.strip(),

        "email": user.email.lower(),

        "registration_number": user.registration_number.upper(),

        "degree_programme": user.degree_programme.strip(),

        "password": hash_password(user.password),

        "role": "student",

        "is_active": True,

        "created_at": datetime.utcnow()

    }

    users_collection.insert_one(new_user)

    return {

        "success": True,

        "message": "Student registered successfully."

    }


# ----------------------------
# Login User
# ----------------------------

def login_user(user):

    existing_user = users_collection.find_one(
        {
            "email": user.email.lower()
        }
    )

    if not existing_user:

        return {
            "success": False,
            "message": "Invalid email or password."
        }

    if not verify_password(
        user.password,
        existing_user["password"]
    ):

        return {
            "success": False,
            "message": "Invalid email or password."
        }

    if not existing_user["is_active"]:

        return {
            "success": False,
            "message": "Your account has been deactivated."
        }

    token = create_access_token(
        {
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    )

    return {

        "success": True,

        "message": "Login successful.",

        "access_token": token,

        "token_type": "bearer",

        "user": {

            "full_name": existing_user["full_name"],

            "email": existing_user["email"],

            "registration_number": existing_user["registration_number"],

            "degree_programme": existing_user["degree_programme"],

            "role": existing_user["role"]

        }

    }