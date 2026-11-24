from pydantic import BaseModel
from typing import List


class ResearchCreate(BaseModel):
    research_title: str
    research_description: str
    problem_statement: str
    proposed_solution: str
    research_objectives: List[str]
    keywords: List[str]