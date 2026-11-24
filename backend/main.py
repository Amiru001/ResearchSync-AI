from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth_routes import router as auth_router
from app.routes.research_routes import router as research_router
from app.routes.openalex_routes import router as openalex_router

from app.routes.supervisor_routes import router as supervisor_router

from app.routes.plagiarism_routes import router as plagiarism_router

app = FastAPI()

# Allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(research_router)
app.include_router(supervisor_router)
app.include_router(plagiarism_router)
app.include_router(openalex_router)

@app.get("/")
def home():
    return {
        "message": "Backend Working"
    }