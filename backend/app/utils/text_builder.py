def build_research_text(data):
    """
    Build one complete research text for
    Sentence-BERT based AI modules.
    """

    return (
        f"Research Title: {data.research_title}\n"
        f"Research Description: {data.research_description}\n"
        f"Problem Statement: {data.problem_statement}\n"
        f"Proposed Solution: {data.proposed_solution}\n"
        f"Research Objectives: {data.research_objectives}\n"
        f"Keywords: {', '.join(data.keywords)}"
    )