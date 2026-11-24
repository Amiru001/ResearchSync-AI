import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=5000
)

# Test the connection immediately
client.admin.command("ping")

db = client[DATABASE_NAME]