const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// ============================================================
// REGISTER STUDENT
// ============================================================

export const registerStudent = async (userData) => {

  const response = await fetch(
    `${BASE_URL}/api/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  return {
    status: response.status,
    data,
  };
};


// ============================================================
// LOGIN STUDENT / SUPERVISOR
// ============================================================

export const loginStudent = async (userData) => {

  const response = await fetch(
    `${BASE_URL}/api/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  return {
    status: response.status,
    data,
  };
};


// ============================================================
// SUBMIT RESEARCH
// ============================================================

export const submitResearch = async (researchData) => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/api/research/submit`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        // JWT authentication
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(researchData),
    }
  );

  const data = await response.json();

  return {
    status: response.status,
    data,
  };
};


// ============================================================
// GET RECOMMENDATIONS
// ============================================================

export const getRecommendations = async () => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/api/supervisor/recommendations`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",

        // JWT authentication
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return {
    status: response.status,
    data,
  };
};