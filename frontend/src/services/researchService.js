import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});


// ============================================================
// GET AUTHORIZATION HEADER
// ============================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};


// ============================================================
// GET LATEST RESEARCH
// ============================================================

export const getLatestResearch = async () => {

  const response = await API.get(
    "/research/latest",
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


// ============================================================
// GET SUPERVISOR MESSAGES
// ============================================================

export const getSupervisorMessages = async () => {

  const response = await API.get(
    "/research/supervisor-messages",
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};