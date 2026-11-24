from app.config.database import db
from bson import ObjectId


research_collection = db["research_ideas"]
users_collection = db["users"]
messages_collection = db["supervisor_messages"]


# ============================================================
# GET RECOMMENDED RESEARCH IDEAS
# ============================================================

# ============================================================
# GET RECOMMENDED RESEARCH IDEAS
# ============================================================

def get_recommended_research_ideas(
    supervisor_name,
    supervisor_email,
):

    # --------------------------------------------------------
    # Get all proposals that are still available
    # --------------------------------------------------------

    proposals = research_collection.find(
        {
            "recommended_supervisor.top_supervisors": {
                "$elemMatch": {
                    "$or": [
                        {
                            "supervisor_name": supervisor_name
                        },
                        {
                            "supervisor_email": supervisor_email
                        },
                    ]
                }
            },

            # Do not show already accepted/rejected proposals
            "supervision.status": {
                "$nin": ["Accepted", "Rejected"]
            },
        }
    )

    results = []

    for proposal in proposals:

        # ----------------------------------------------------
        # Student Details
        # ----------------------------------------------------

        student_id = proposal.get("student_id")

        student = users_collection.find_one(
            {
                "registration_number": student_id
            }
        )

        if student:

            student_info = {
                "name": student.get(
                    "full_name",
                    "Unknown Student"
                ),

                "registration": student.get(
                    "registration_number",
                    student_id or "-"
                ),
            }

        else:

            student_info = {
                "name": "Unknown Student",

                "registration": (
                    student_id or "-"
                ),
            }

        # ----------------------------------------------------
        # Find THIS supervisor's matching score
        # ----------------------------------------------------

        matching_score = 0

        recommended = (
            proposal.get(
                "recommended_supervisor"
            ) or {}
        )

        supervisors = (
            recommended.get(
                "top_supervisors",
                []
            )
        )

        # --------------------------------------------------------
        # Only the #1 recommended supervisor receives
        # the pending research request
        # --------------------------------------------------------

        if supervisors:

            best_supervisor = supervisors[0]

            recommended_name = best_supervisor.get(
            "supervisor_name"
            )

            recommended_email = best_supervisor.get(
            "supervisor_email"
            )

            if (
                recommended_email == supervisor_email
                or
                recommended_name == supervisor_name
            ):

                matching_score = best_supervisor.get(
                "overall_score",
                0
                )

            else:

                continue

        # ----------------------------------------------------
        # Research Domain
        # ----------------------------------------------------

        domain = "Not Classified"

        if proposal.get("domain"):

            domain = proposal["domain"].get(
                "primary_domain",
                "Not Classified"
            )

        # ----------------------------------------------------
        # Created Date
        # ----------------------------------------------------

        created_at = proposal.get("created_at")

        submitted_date = ""
        submitted_time = ""

        if created_at:

            submitted_date = created_at.strftime(
                "%d %b %Y"
            )

            submitted_time = created_at.strftime(
                "%I:%M %p"
            )

        # ----------------------------------------------------
        # Build Response
        # ----------------------------------------------------

        results.append({

            "id": str(
                proposal["_id"]
            ),

            "title": proposal.get(
                "research_title",
                ""
            ),

            "student": student_info,

            "domain": domain,

            "matchingScore": round(
                float(matching_score),
                2
            ),

            "submittedDate": submitted_date,

            "submittedTime": submitted_time,

        })

    # --------------------------------------------------------
    # Highest matching score first
    # --------------------------------------------------------

    results.sort(
        key=lambda item: item["matchingScore"],
        reverse=True
    )

    return results


# ============================================================
# GET SINGLE RESEARCH IDEA DETAILS
# ============================================================

def get_research_idea_details(research_id):

    # ------------------------------------
    # Find Research Proposal
    # ------------------------------------

    try:

        proposal = research_collection.find_one(
            {
                "_id": ObjectId(research_id)
            }
        )

    except Exception:

        return {
            "message": "Invalid research ID."
        }

    if proposal is None:

        return {
            "message": "Research proposal not found."
        }

    # ------------------------------------
    # Get Student Details
    # ------------------------------------

    student_id = proposal.get(
        "student_id"
    )

    student = users_collection.find_one(
        {
            "registration_number": student_id
        }
    )

    if student:

        student_info = {

            "name": student.get(
                "full_name",
                "Unknown Student"
            ),

            "registrationNumber": student.get(
                "registration_number",
                student_id
            ),

            "degree": student.get(
                "degree_programme",
                "Not Available"
            ),
        }

    else:

        student_info = {

            "name": "Unknown Student",

            "registrationNumber": student_id,

            "degree": "Not Available",
        }

    # ------------------------------------
    # Get Domain
    # ------------------------------------

    domain_data = proposal.get(
        "domain"
    ) or {}

    domain = domain_data.get(
        "primary_domain",
        "Not Classified"
    )

    # ------------------------------------
    # Get Supervisor Matching Score
    # ------------------------------------

    recommended_supervisor = (
        proposal.get(
            "recommended_supervisor"
        ) or {}
    )

    top_supervisors = (
        recommended_supervisor.get(
            "top_supervisors",
            []
        )
    )

    matching_score = 0

    if len(top_supervisors) > 0:

        matching_score = top_supervisors[0].get(
            "overall_score",
            0
        )

    # ------------------------------------
    # Topic Similarity
    # ------------------------------------

    similarity_data = (
        proposal.get(
            "similarity_score"
        ) or {}
    )

    similarity_score = similarity_data.get(
        "similarity_percentage",
        0
    )

    matched_title = similarity_data.get(
        "matched_title"
    )

    # ------------------------------------
    # Created Date
    # ------------------------------------

    created_at = proposal.get(
        "created_at"
    )

    submitted_date = ""
    submitted_time = ""

    if created_at:

        submitted_date = created_at.strftime(
            "%d %b %Y"
        )

        submitted_time = created_at.strftime(
            "%I:%M %p"
        )

    # ------------------------------------
    # Research Objectives
    # ------------------------------------

    objectives = proposal.get(
        "research_objectives",
        ""
    )

    # ------------------------------------
    # Build Detailed Response
    # ------------------------------------

    return {

        "id": str(
            proposal["_id"]
        ),

        "title": proposal.get(
            "research_title",
            "Untitled Research"
        ),

        "student": student_info,

        "domain": domain,

        "domainConfidence": domain_data.get(
            "confidence",
            0
        ),

        "matchingScore": round(
            float(matching_score),
            2
        ),

        "submittedDate": submitted_date,

        "submittedTime": submitted_time,

        "description": proposal.get(
            "research_description",
            ""
        ),

        "problemStatement": proposal.get(
            "problem_statement",
            ""
        ),

        "proposedSolution": proposal.get(
            "proposed_solution",
            ""
        ),

        "objectives": objectives,

        "keywords": proposal.get(
            "keywords",
            []
        ),

        "similarity": {

            "score": round(
                float(similarity_score),
                2
            ),

            "closestTopic": (
                matched_title
                if matched_title
                else "No matching proposal found"
            ),
        },

        "supervisors": top_supervisors,

        "status": proposal.get(
            "status",
            "Submitted"
        ),
    }


    # ============================================================
# ACCEPT RESEARCH PROPOSAL
# ============================================================

def accept_research_proposal(
    research_id,
    supervisor_name,
    supervisor_email,
    comment,
):

    # ------------------------------------
    # Validate Research ID
    # ------------------------------------

    try:

        object_id = ObjectId(research_id)

    except Exception:

        return {
            "success": False,
            "message": "Invalid research ID."
        }

    # ------------------------------------
    # Find Research Proposal
    # ------------------------------------

    proposal = research_collection.find_one(
        {
            "_id": object_id
        }
    )

    if proposal is None:

        return {
            "success": False,
            "message": "Research proposal not found."
        }

    # ------------------------------------
    # Check Current Supervision Status
    # ------------------------------------

    current_supervision = (
        proposal.get("supervision") or {}
    )

    current_status = current_supervision.get(
        "status",
        "Pending"
    )

    if current_status == "Accepted":

        return {
            "success": False,
            "message": "This proposal has already been accepted."
        }

    # ------------------------------------
    # Update Proposal
    # ------------------------------------

    from datetime import datetime, timezone

    accepted_at = datetime.now(timezone.utc)

    research_collection.update_one(

        {
            "_id": object_id
        },

        {
            "$set": {

                "supervision.status": "Accepted",

                "supervision.supervisor_name":
                    supervisor_name,

                "supervision.supervisor_email":
                    supervisor_email,

                "supervision.supervisor_comment":
                    comment,

                "supervision.accepted_at":
                    accepted_at,

                "supervision.rejected_at":
                    None,

            }
        }
    )

    # ------------------------------------
    # Return Success
    # ------------------------------------

    return {

        "success": True,

        "message":
            "Proposal accepted successfully.",

        "research_id":
            research_id,

        "status":
            "Accepted",

        "supervisor_name":
            supervisor_name,

        "supervisor_email":
            supervisor_email,

        "supervisor_comment":
            comment,

        "accepted_at":
            accepted_at.isoformat(),

    }


# ============================================================
# REJECT RESEARCH PROPOSAL
# ============================================================

def reject_research_proposal(
    research_id,
    supervisor_name,
    supervisor_email,
    reason,
):

    # ------------------------------------
    # Validate Research ID
    # ------------------------------------

    try:

        object_id = ObjectId(research_id)

    except Exception:

        return {
            "success": False,
            "message": "Invalid research ID."
        }

    # ------------------------------------
    # Find Research Proposal
    # ------------------------------------

    proposal = research_collection.find_one(
        {
            "_id": object_id
        }
    )

    if proposal is None:

        return {
            "success": False,
            "message": "Research proposal not found."
        }

    # ------------------------------------
    # Check Current Supervision Status
    # ------------------------------------

    current_supervision = (
        proposal.get("supervision") or {}
    )

    current_status = current_supervision.get(
        "status",
        "Pending"
    )

    if current_status == "Accepted":

        return {
            "success": False,
            "message":
                "This proposal has already been accepted and cannot be rejected."
        }

    # ------------------------------------
    # Update Proposal
    # ------------------------------------

    from datetime import datetime, timezone

    rejected_at = datetime.now(timezone.utc)

    research_collection.update_one(

        {
            "_id": object_id
        },

        {
            "$set": {

                "supervision.status":
                    "Rejected",

                "supervision.supervisor_name":
                    supervisor_name,

                "supervision.supervisor_email":
                    supervisor_email,

                "supervision.supervisor_comment":
                    reason,

                "supervision.rejected_at":
                    rejected_at,

                "supervision.accepted_at":
                    None,

            }
        }
    )

    # ------------------------------------
    # Return Success
    # ------------------------------------

    return {

        "success": True,

        "message":
            "Proposal rejected successfully.",

        "research_id":
            research_id,

        "status":
            "Rejected",

        "supervisor_name":
            supervisor_name,

        "supervisor_email":
            supervisor_email,

        "supervisor_comment":
            reason,

        "rejected_at":
            rejected_at.isoformat(),

    }


# ============================================================
# GET MY SUPERVISIONS
# ============================================================

def get_my_supervisions(
    supervisor_name,
    supervisor_email,
):

    # --------------------------------------------------------
    # Find accepted proposals
    # --------------------------------------------------------

    proposals = research_collection.find(
        {
            "supervision.status": "Accepted"
        }
    )

    results = []

    for proposal in proposals:

        supervision = (
            proposal.get("supervision") or {}
        )


        # ----------------------------------------------------
        # Only include proposals assigned to this supervisor
        # ----------------------------------------------------

        if (
            supervision.get("supervisor_name")
            != supervisor_name
            or
            supervision.get("supervisor_email")
            != supervisor_email
        ):

            continue


        # ----------------------------------------------------
        # Get Student Details
        # ----------------------------------------------------

        student_id = proposal.get(
            "student_id"
        )

        student = users_collection.find_one(
            {
                "registration_number": student_id
            }
        )


        if student:

            student_info = {

                "name": student.get(
                    "full_name",
                    "Unknown Student"
                ),

                "registration": student.get(
                    "registration_number",
                    student_id or "-"
                ),

            }

        else:

            student_info = {

                "name": "Unknown Student",

                "registration": (
                    student_id or "-"
                ),

            }


        # ----------------------------------------------------
        # Get Research Domain
        # ----------------------------------------------------

        domain_data = (
            proposal.get("domain") or {}
        )

        domain = domain_data.get(
            "primary_domain",
            "Not Classified"
        )


        # ----------------------------------------------------
        # Get Matching Score
        # ----------------------------------------------------

        matching_score = 0

        recommended = (
            proposal.get(
                "recommended_supervisor"
            ) or {}
        )

        top_supervisors = (
            recommended.get(
                "top_supervisors",
                []
            )
        )


        # ----------------------------------------------------
        # Find the accepted supervisor's score
        # ----------------------------------------------------

        for supervisor in top_supervisors:

            supervisor_name_from_recommendation = (
                supervisor.get(
                    "supervisor_name"
                )
            )

            supervisor_email_from_recommendation = (
                supervisor.get(
                    "supervisor_email"
                )
            )


            if (
                supervisor_name_from_recommendation
                == supervisor_name
                or
                supervisor_email_from_recommendation
                == supervisor_email
            ):

                matching_score = supervisor.get(
                    "overall_score",
                    0
                )

                break


        # ----------------------------------------------------
        # Fallback
        # ----------------------------------------------------
        # If the assigned supervisor is not found inside
        # top_supervisors, use the first recommended supervisor
        # score when available.
        #
        # This prevents the table from incorrectly displaying
        # 0% when the proposal was successfully assigned.
        # ----------------------------------------------------

        if (
            matching_score == 0
            and len(top_supervisors) > 0
        ):

            matching_score = top_supervisors[0].get(
                "overall_score",
                0
            )


        # ----------------------------------------------------
        # Submitted Date
        # ----------------------------------------------------

        created_at = proposal.get(
            "created_at"
        )

        submitted_date = ""
        submitted_time = ""


        if created_at:

            submitted_date = created_at.strftime(
                "%d %b %Y"
            )

            submitted_time = created_at.strftime(
                "%I:%M %p"
            )


        # ----------------------------------------------------
        # Supervisor Comment
        # ----------------------------------------------------

        supervisor_comment = supervision.get(
            "supervisor_comment",
            ""
        )


        # ----------------------------------------------------
        # Build Response
        # ----------------------------------------------------

        results.append({

            "id": str(
                proposal["_id"]
            ),

            "title": proposal.get(
                "research_title",
                ""
            ),

            "student": student_info,

            "domain": domain,

            "matchingScore": round(
                float(matching_score),
                2
            ),

            "submittedDate": submitted_date,

            "submittedTime": submitted_time,

            "supervisorComment":
                supervisor_comment,

            "status":
                supervision.get(
                    "status",
                    "Accepted"
                ),

        })


    return results

# ============================================================
# GET ONE MY SUPERVISION DETAILS
# ============================================================

def get_my_supervision_details(
    research_id,
    supervisor_name,
    supervisor_email,
):

    # --------------------------------------------------------
    # Validate Research ID
    # --------------------------------------------------------

    try:

        object_id = ObjectId(research_id)

    except Exception:

        return {
            "success": False,
            "message": "Invalid research ID."
        }


    # --------------------------------------------------------
    # Find Accepted Proposal Assigned To This Supervisor
    # --------------------------------------------------------

    proposal = research_collection.find_one(
        {
            "_id": object_id,

            "supervision.supervisor_email":
                supervisor_email,

            "supervision.status":
                "Accepted",
        }
    )


    # --------------------------------------------------------
    # Proposal Not Found
    # --------------------------------------------------------

    if proposal is None:

        return {
            "success": False,
            "message":
                "Accepted supervision not found."
        }


    # --------------------------------------------------------
    # Student Details
    # --------------------------------------------------------

    student_id = proposal.get(
        "student_id"
    )


    student = users_collection.find_one(
        {
            "registration_number":
                student_id
        }
    )


    if student:

        student_info = {

            "name": student.get(
                "full_name",
                "Unknown Student"
            ),

            "registrationNumber":
                student.get(
                    "registration_number",
                    student_id
                ),

            "degree": student.get(
                "degree_programme",
                "Not Available"
            ),

        }

    else:

        student_info = {

            "name": "Unknown Student",

            "registrationNumber":
                student_id,

            "degree":
                "Not Available",

        }


    # --------------------------------------------------------
    # Domain
    # --------------------------------------------------------

    domain_data = (
        proposal.get("domain")
        or {}
    )


    domain = domain_data.get(
        "primary_domain",
        "Not Classified"
    )


    # --------------------------------------------------------
    # Matching Score
    # --------------------------------------------------------

    matching_score = 0


    recommended_supervisor = (
        proposal.get(
            "recommended_supervisor"
        ) or {}
    )


    top_supervisors = (
        recommended_supervisor.get(
            "top_supervisors",
            []
        )
    )


    # Find the accepted supervisor's score

    for supervisor in top_supervisors:

        supervisor_name_from_recommendation = (
            supervisor.get(
                "supervisor_name"
            )
        )

        supervisor_email_from_recommendation = (
            supervisor.get(
                "supervisor_email"
            )
        )


        if (
            supervisor_name_from_recommendation
            == supervisor_name

            or

            supervisor_email_from_recommendation
            == supervisor_email
        ):

            matching_score = supervisor.get(
                "overall_score",
                0
            )

            break


    # --------------------------------------------------------
    # Fallback
    # --------------------------------------------------------

    if (
        matching_score == 0
        and len(top_supervisors) > 0
    ):

        matching_score = top_supervisors[0].get(
            "overall_score",
            0
        )


    # --------------------------------------------------------
    # Similarity
    # --------------------------------------------------------

    similarity_data = (
        proposal.get(
            "similarity_score"
        )
        or {}
    )


    similarity_score = similarity_data.get(
        "similarity_percentage",
        0
    )


    matched_title = similarity_data.get(
        "matched_title"
    )


    # --------------------------------------------------------
    # Created Date
    # --------------------------------------------------------

    created_at = proposal.get(
        "created_at"
    )


    submitted_date = ""
    submitted_time = ""


    if created_at:

        submitted_date = created_at.strftime(
            "%d %b %Y"
        )

        submitted_time = created_at.strftime(
            "%I:%M %p"
        )


    # --------------------------------------------------------
    # Objectives
    # --------------------------------------------------------

    objectives = proposal.get(
        "research_objectives",
        []
    )


    # --------------------------------------------------------
    # Supervision Information
    # --------------------------------------------------------

    supervision = (
        proposal.get(
            "supervision"
        )
        or {}
    )


    # --------------------------------------------------------
    # Return Details
    # --------------------------------------------------------

    return {

        "success": True,

        "id": str(
            proposal["_id"]
        ),

        "title": proposal.get(
            "research_title",
            "Untitled Research"
        ),

        "student": student_info,

        "domain": domain,

        "domainConfidence":
            domain_data.get(
                "confidence",
                0
            ),

        "matchingScore": round(
            float(matching_score),
            2
        ),

        "submittedDate":
            submitted_date,

        "submittedTime":
            submitted_time,

        "description":
            proposal.get(
                "research_description",
                ""
            ),

        "problemStatement":
            proposal.get(
                "problem_statement",
                ""
            ),

        "proposedSolution":
            proposal.get(
                "proposed_solution",
                ""
            ),

        "objectives":
            objectives,

        "keywords":
            proposal.get(
                "keywords",
                []
            ),

        "similarity": {

            "score": round(
                float(similarity_score),
                2
            ),

            "closestTopic":
                matched_title
                if matched_title
                else
                "No matching proposal found",

        },

        "supervisor": {

            "name":
                supervision.get(
                    "supervisor_name",
                    supervisor_name
                ),

            "email":
                supervision.get(
                    "supervisor_email",
                    supervisor_email
                ),

            "status":
                supervision.get(
                    "status",
                    "Accepted"
                ),

            "comment":
                supervision.get(
                    "supervisor_comment",
                    ""
                ),

            "acceptedAt":
                supervision.get(
                    "accepted_at"
                ),

        },

        "status":
            supervision.get(
                "status",
                "Accepted"
            ),

    }


# ============================================================
# UPDATE MY SUPERVISION DETAILS
# ============================================================

def update_my_supervision_details(
    research_id,
    supervisor_name,
    supervisor_email,
    title=None,
    description=None,
    problem_statement=None,
    objectives=None,
):

    # --------------------------------------------------------
    # Validate Research ID
    # --------------------------------------------------------

    try:

        object_id = ObjectId(research_id)

    except Exception:

        return {
            "success": False,
            "message": "Invalid research ID."
        }


    # --------------------------------------------------------
    # Find accepted supervision belonging to this supervisor
    # --------------------------------------------------------

    proposal = research_collection.find_one(
        {
            "_id": object_id,
            "supervision.supervisor_email": supervisor_email,
            "supervision.status": "Accepted",
        }
    )


    # --------------------------------------------------------
    # Proposal not found
    # --------------------------------------------------------

    if proposal is None:

        return {
            "success": False,
            "message": "Accepted supervision not found."
        }


    # --------------------------------------------------------
    # Build MongoDB update
    # --------------------------------------------------------

    update_data = {}


    # --------------------------------------------------------
    # TITLE
    # --------------------------------------------------------

    if title is not None:

        if isinstance(title, str):

            cleaned_title = title.strip()

            if cleaned_title:

                update_data["research_title"] = cleaned_title


    # --------------------------------------------------------
    # DESCRIPTION
    # --------------------------------------------------------

    if description is not None:

        update_data["research_description"] = (
            description.strip()
            if isinstance(description, str)
            else ""
        )


    # --------------------------------------------------------
    # PROBLEM STATEMENT
    # --------------------------------------------------------

    if problem_statement is not None:

        update_data["problem_statement"] = (
            problem_statement.strip()
            if isinstance(problem_statement, str)
            else ""
        )


    # --------------------------------------------------------
    # OBJECTIVES
    # --------------------------------------------------------

    if objectives is not None:

        if not isinstance(objectives, list):

            objectives = (
                [objectives]
                if objectives
                else []
            )


        objectives = [
            objective.strip()
            for objective in objectives
            if isinstance(objective, str)
            and objective.strip()
        ]


        update_data["research_objectives"] = objectives


    # --------------------------------------------------------
    # Nothing to update
    # --------------------------------------------------------

    if not update_data:

        return {
            "success": False,
            "message": "No changes were provided."
        }


    # --------------------------------------------------------
    # Updated time
    # --------------------------------------------------------

    from datetime import datetime, timezone

    updated_at = datetime.now(timezone.utc)

    update_data["supervision.updated_at"] = updated_at


    # --------------------------------------------------------
    # Update MongoDB
    # --------------------------------------------------------

    result = research_collection.update_one(

        {
            "_id": object_id,
            "supervision.supervisor_email":
                supervisor_email,
            "supervision.status":
                "Accepted",
        },

        {
            "$set": update_data
        }

    )


    # --------------------------------------------------------
    # Check update
    # --------------------------------------------------------

    if result.modified_count == 0:

        return {
            "success": False,
            "message": "No changes were made."
        }


    # --------------------------------------------------------
    # Return success
    # --------------------------------------------------------

    return {

        "success": True,

        "message":
            "Supervision details updated successfully.",

        "research_id":
            research_id,

        "updatedFields":
            list(update_data.keys()),

        "updatedAt":
            updated_at.isoformat(),

    }



# ============================================================
# GET SUPERVISOR DASHBOARD
# ============================================================

# ============================================================
# GET SUPERVISOR DASHBOARD
# ============================================================

def get_supervisor_dashboard(
    supervisor_name,
    supervisor_email,
):

    # --------------------------------------------------------
    # Get all research proposals
    # --------------------------------------------------------

    proposals = list(
        research_collection.find()
    )

    # --------------------------------------------------------
    # Counters
    # --------------------------------------------------------

    pending_requests = 0

    # Count only proposals actually accepted
    # by the currently logged-in supervisor.
    accepted_supervisions = research_collection.count_documents(
        {
            "supervision.status": "Accepted",
            "$or": [
                {
                    "supervision.supervisor_name":
                        supervisor_name
                },
                {
                    "supervision.supervisor_email":
                        supervisor_email
                }
            ]
        }
    )

    # Matching scores relevant to this supervisor
    matching_scores = []

    # Domain counts relevant to this supervisor
    domain_counts = {}


    # ========================================================
    # PROCESS EACH PROPOSAL
    # ========================================================

    for proposal in proposals:

        # ----------------------------------------------------
        # Domain
        # ----------------------------------------------------

        domain_data = (
            proposal.get("domain") or {}
        )

        domain = domain_data.get(
            "primary_domain",
            "Not Classified"
        )


        # ----------------------------------------------------
        # Supervision
        # ----------------------------------------------------

        supervision = (
            proposal.get("supervision") or {}
        )

        status = supervision.get(
            "status",
            "Pending"
        )


        # ----------------------------------------------------
        # Assigned supervisor
        # ----------------------------------------------------

        assigned_supervisor_name = (
            supervision.get(
                "supervisor_name"
            )
        )

        assigned_supervisor_email = (
            supervision.get(
                "supervisor_email"
            )
        )


        # ====================================================
        # IS THIS PROPOSAL ALREADY ASSIGNED TO THIS SUPERVISOR?
        # ====================================================

        is_assigned = (
            status == "Accepted"
            and
            (
                assigned_supervisor_name
                == supervisor_name

                or

                assigned_supervisor_email
                == supervisor_email
            )
        )


        # ====================================================
        # RECOMMENDED SUPERVISORS
        # ====================================================

        recommended_supervisor = (
            proposal.get(
                "recommended_supervisor"
            ) or {}
        )

        top_supervisors = (
            recommended_supervisor.get(
                "top_supervisors",
                []
            )
        )


        # ====================================================
        # DEFAULT VALUES
        # ====================================================

        is_recommended = False

        supervisor_score = None


        # ====================================================
        # ACCEPTED PROPOSAL
        #
        # If this supervisor already accepted the proposal,
        # find THIS supervisor's own matching score.
        # ====================================================

        if is_assigned:

            for supervisor in top_supervisors:

                recommendation_name = (
                    supervisor.get(
                        "supervisor_name"
                    )
                )

                recommendation_email = (
                    supervisor.get(
                        "supervisor_email"
                    )
                )

                if (
                    recommendation_name
                    == supervisor_name

                    or

                    recommendation_email
                    == supervisor_email
                ):

                    supervisor_score = (
                        supervisor.get(
                            "overall_score",
                            0
                        )
                    )

                    break


        # ====================================================
        # PENDING PROPOSAL
        #
        # Only the #1 recommended supervisor gets the
        # pending request.
        # ====================================================

        elif status not in [
            "Accepted",
            "Rejected"
        ]:

            if top_supervisors:

                best_supervisor = (
                    top_supervisors[0]
                )

                recommended_name = (
                    best_supervisor.get(
                        "supervisor_name"
                    )
                )

                recommended_email = (
                    best_supervisor.get(
                        "supervisor_email"
                    )
                )

                # Only #1 supervisor gets this proposal
                if (
                    recommended_name
                    == supervisor_name

                    or

                    recommended_email
                    == supervisor_email
                ):

                    is_recommended = True

                    supervisor_score = (
                        best_supervisor.get(
                            "overall_score",
                            0
                        )
                    )


        # ====================================================
        # RECOMMENDATION OVERVIEW
        #
        # Show:
        # 1. Accepted proposals belonging to this supervisor
        # 2. Pending proposals where this supervisor is #1
        #
        # Do NOT show rejected proposals.
        # ====================================================

        if (
            status != "Rejected"
            and
            (
                is_assigned
                or
                is_recommended
            )
        ):

            domain_counts[domain] = (
                domain_counts.get(
                    domain,
                    0
                ) + 1
            )


        # ====================================================
        # MATCHING SCORE
        # ====================================================

        if supervisor_score is not None:

            try:

                matching_scores.append(
                    float(
                        supervisor_score
                    )
                )

            except (
                ValueError,
                TypeError
            ):

                pass


        # ====================================================
        # PENDING REQUEST COUNT
        # ====================================================

        if (
            status not in [
                "Accepted",
                "Rejected"
            ]
            and
            is_recommended
        ):

            pending_requests += 1


    # ========================================================
    # AVERAGE MATCHING SCORE
    # ========================================================

    if matching_scores:

        average_matching_score = round(
            sum(matching_scores)
            / len(matching_scores),
            2
        )

    else:

        average_matching_score = 0


    # ========================================================
    # MAXIMUM WORKLOAD
    # ========================================================

    maximum_workload = 15


    # ========================================================
    # CURRENT WORKLOAD
    # ========================================================

    current_workload = (
        accepted_supervisions
    )


    # ========================================================
    # AVAILABLE SLOTS
    # ========================================================

    available_slots = max(
        maximum_workload
        - current_workload,
        0
    )


    # ========================================================
    # WORKLOAD PERCENTAGE
    # ========================================================

    workload_percentage = (
        round(
            (
                current_workload
                / maximum_workload
            ) * 100,
            2
        )
        if maximum_workload > 0
        else 0
    )


    # ========================================================
    # RECOMMENDATION OVERVIEW
    # ========================================================

    total_domains = sum(
        domain_counts.values()
    )

    recommendations = []


    for domain, count in domain_counts.items():

        percentage = (
            round(
                (
                    count
                    / total_domains
                ) * 100,
                1
            )
            if total_domains > 0
            else 0
        )

        recommendations.append(
            {
                "domain": domain,
                "count": count,
                "percentage": percentage,
            }
        )


    # ========================================================
    # SORT BY COUNT
    # ========================================================

    recommendations.sort(
        key=lambda item: item["count"],
        reverse=True
    )


    # ========================================================
    # RETURN DASHBOARD DATA
    # ========================================================

    return {

        "success": True,

        "supervisor": {
            "name": supervisor_name,
        },

        "statistics": {

            "pendingRequests":
                pending_requests,

            "acceptedSupervisions":
                accepted_supervisions,

            "averageMatchingScore":
                average_matching_score,

            "availableSlots":
                available_slots,

            "currentWorkload":
                current_workload,

            "maximumWorkload":
                maximum_workload,

            "workloadPercentage":
                workload_percentage,

        },

        "recommendations":
            recommendations,

    }


# ============================================================
# SEND SUPERVISOR MESSAGE
# ============================================================

def send_supervisor_message(
    research_id,
    supervisor_name,
    supervisor_email,
    message,
    recipient_type,
):

    # --------------------------------------------------------
    # Validate message
    # --------------------------------------------------------

    if not isinstance(message, str) or not message.strip():

        return {
            "success": False,
            "message": "Message cannot be empty."
        }

    message = message.strip()


    # --------------------------------------------------------
    # Validate recipient type
    # --------------------------------------------------------

    if recipient_type not in [
        "student",
        "all"
    ]:

        return {
            "success": False,
            "message": "Invalid recipient type."
        }


    # --------------------------------------------------------
    # Validate research ID
    # --------------------------------------------------------

    try:

        object_id = ObjectId(research_id)

    except Exception:

        return {
            "success": False,
            "message": "Invalid research ID."
        }


    # --------------------------------------------------------
    # Find the selected proposal
    #
    # The proposal must be accepted and belong to
    # the currently logged-in supervisor.
    # --------------------------------------------------------

    selected_proposal = research_collection.find_one(
        {
            "_id": object_id,

            "supervision.status":
                "Accepted",

            "$or": [

                {
                    "supervision.supervisor_name":
                        supervisor_name
                },

                {
                    "supervision.supervisor_email":
                        supervisor_email
                }

            ]
        }
    )


    # --------------------------------------------------------
    # Proposal not found
    # --------------------------------------------------------

    if selected_proposal is None:

        return {
            "success": False,
            "message":
                "Accepted supervision not found."
        }


    # --------------------------------------------------------
    # Determine recipients
    # --------------------------------------------------------

    recipient_ids = []


    # ========================================================
    # THIS STUDENT
    # ========================================================

    if recipient_type == "student":

        student_id = selected_proposal.get(
            "student_id"
        )

        if not student_id:

            return {
                "success": False,
                "message":
                    "Student information not found."
            }

        recipient_ids.append(
            student_id
        )


    # ========================================================
    # ALL STUDENTS SUPERVISED BY THIS SUPERVISOR
    # ========================================================

    elif recipient_type == "all":

        proposals = research_collection.find(
            {
                "supervision.status":
                    "Accepted",

                "$or": [

                    {
                        "supervision.supervisor_name":
                            supervisor_name
                    },

                    {
                        "supervision.supervisor_email":
                            supervisor_email
                    }

                ]
            }
        )

        for proposal in proposals:

            student_id = proposal.get(
                "student_id"
            )

            if (
                student_id
                and
                student_id not in recipient_ids
            ):

                recipient_ids.append(
                    student_id
                )


    # --------------------------------------------------------
    # Check recipients
    # --------------------------------------------------------

    if not recipient_ids:

        return {
            "success": False,
            "message":
                "No students found."
        }


    # --------------------------------------------------------
    # Create message documents
    # --------------------------------------------------------

    from datetime import datetime, timezone

    created_at = datetime.now(
        timezone.utc
    )

    message_documents = []


    for student_id in recipient_ids:

        message_documents.append(
            {
                "sender": {

                    "name":
                        supervisor_name,

                    "email":
                        supervisor_email,

                    "role":
                        "supervisor",

                },

                "recipient_registration":
                    student_id,

                "recipient_type":
                    recipient_type,

                "message":
                    message,

                "research_id":
                    research_id,

                "read":
                    False,

                "created_at":
                    created_at,
            }
        )


    # --------------------------------------------------------
    # Save messages to MongoDB
    # --------------------------------------------------------

    result = messages_collection.insert_many(
        message_documents
    )


    # --------------------------------------------------------
    # Return success
    # --------------------------------------------------------

    return {

        "success": True,

        "message":
            "Message sent successfully.",

        "recipientType":
            recipient_type,

        "recipientCount":
            len(result.inserted_ids),

        "messageText":
            message,

    }



# ============================================================
# GET STUDENT SUPERVISOR MESSAGES
# ============================================================

def get_student_supervisor_messages(student_id):

    messages = messages_collection.find(
        {
            "recipient_registration": student_id
        }
    ).sort(
        "created_at",
        -1
    )

    results = []

    for message in messages:

        results.append({
            "_id": str(message["_id"]),

            "message": message.get(
                "message",
                ""
            ),

            "sender": {
                "name": message.get(
                    "sender",
                    {}
                ).get(
                    "name",
                    "Supervisor"
                ),

                "email": message.get(
                    "sender",
                    {}
                ).get(
                    "email",
                    ""
                ),
            },

            "read": message.get(
                "read",
                False
            ),

            "research_id": message.get(
                "research_id"
            ),

            "created_at": (
                message.get(
                    "created_at"
                ).isoformat()
                if message.get("created_at")
                else None
            ),
        })

    return {
        "success": True,
        "messages": results,
    }