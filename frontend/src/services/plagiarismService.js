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
// RESPONSE HANDLER
// ============================================================

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "Plagiarism check failed."
    );
  }

  return data;
};

// ============================================================
// CHECK PLAGIARISM
// ============================================================

export const checkPlagiarism = async (text) => {
  const response = await fetch(
    `${BASE_URL}/api/plagiarism/check`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        text,
      }),
    }
  );

  return handleResponse(response);
};

// ============================================================
// ONLINE SCHOLARLY SEARCH
// ============================================================

export const searchExternalSources = async (text) => {
  const response = await fetch(
    `${BASE_URL}/api/plagiarism/external-search`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        text,
      }),
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "External scholarly search failed."
    );
  }

  return data;
};