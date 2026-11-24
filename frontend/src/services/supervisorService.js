const BASE_URL = "http://127.0.0.1:8000";


// ============================================================
// AUTHORIZATION HEADER
// ============================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


// ============================================================
// CHECK RESPONSE
// ============================================================

const handleResponse = async (response, defaultMessage) => {

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.detail ||
      defaultMessage
    );
  }

  return data;
};


// ============================================================
// GET ALL RECOMMENDED RESEARCH IDEAS
// ============================================================

export const getRecommendations = async () => {

  const response = await fetch(
    `${BASE_URL}/api/supervisor/recommendations`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(
    response,
    "Failed to load research recommendations."
  );
};


// ============================================================
// GET ONE RESEARCH PROPOSAL DETAILS
// ============================================================

export const getResearchIdeaDetails = async (
  researchId
) => {

  const response = await fetch(
    `${BASE_URL}/api/supervisor/recommendations/${researchId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(
    response,
    "Failed to load research proposal details."
  );
};


// ============================================================
// ACCEPT RESEARCH PROPOSAL
// ============================================================

export const acceptResearchProposal = async (
  researchId,
  comment
) => {

  const response = await fetch(
    `${BASE_URL}/api/supervisor/recommendations/${researchId}/accept?comment=${encodeURIComponent(
      comment || ""
    )}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(
    response,
    "Failed to accept research proposal."
  );
};


// ============================================================
// REJECT RESEARCH PROPOSAL
// ============================================================

export const rejectResearchProposal = async (
  researchId,
  reason
) => {

  const response = await fetch(
    `${BASE_URL}/api/supervisor/recommendations/${researchId}/reject?reason=${encodeURIComponent(
      reason || ""
    )}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(
    response,
    "Failed to reject research proposal."
  );
};


// ============================================================
// GET MY SUPERVISIONS
// ============================================================

export const getMySupervisions = async () => {

  const response = await fetch(
    `${BASE_URL}/api/supervisor/supervisions`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(
    response,
    "Failed to load my supervisions."
  );
};


// ============================================================
// GET MY SUPERVISION DETAILS
// ============================================================

export const getMySupervisionDetails = async (
  researchId
) => {

  const response = await fetch(
    `${BASE_URL}/api/supervisor/supervisions/${researchId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(
    response,
    "Failed to load supervision details."
  );
};


// ============================================================
// UPDATE MY SUPERVISION DETAILS
// ============================================================

export const updateMySupervisionDetails = async (
  researchId,
  proposal
) => {

  const response = await fetch(
    `${BASE_URL}/api/supervisor/supervisions/${researchId}`,
    {
      method: "PUT",

      headers: getAuthHeaders(),

      body: JSON.stringify({

        // Research title
        title:
          proposal.title || "",

        // Research description
        description:
          proposal.description || "",

        // Problem statement
        problemStatement:
          proposal.problemStatement || "",

        // Research objectives
        objectives:
          Array.isArray(proposal.objectives)
            ? proposal.objectives
            : [],

      }),
    }
  );

  return handleResponse(
    response,
    "Failed to update supervision details."
  );
};


// ============================================================
// GET SUPERVISOR DASHBOARD
// ============================================================

export const getSupervisorDashboard = async () => {

  const response = await fetch(
    `${BASE_URL}/api/supervisor/dashboard`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(
    response,
    "Failed to load supervisor dashboard."
  );
};


// ============================================================
// SEND SUPERVISOR MESSAGE
// ============================================================

export const sendSupervisorMessage = async (
  researchId,
  message,
  recipientType
) => {

  const response = await fetch(
    `${BASE_URL}/api/supervisor/messages?research_id=${encodeURIComponent(
      researchId
    )}`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: JSON.stringify({
        message: message,
        recipientType: recipientType,
      }),
    }
  );

  return handleResponse(
    response,
    "Failed to send message."
  );
};