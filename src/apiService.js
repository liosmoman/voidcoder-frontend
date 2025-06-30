// src/apiService.js

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Helper function to get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const analyzeImage = async (formData) => {
  const token = getAuthToken();
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Note: For FormData with fetch, the browser sets Content-Type automatically.

  try {
    const response = await fetch(`${API_BASE_URL}/prompts/analyze-image`, {
      method: 'POST',
      body: formData,
      headers: headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { detail: response.statusText };
      }
      const error = new Error(errorData.detail || `API request failed with status ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return await response.json();
  } catch (error) {
    // --- THIS IS THE CORRECTED CATCH BLOCK ---
    console.error("Error calling analyzeImage API:", error.data || error.message);
    throw error;
    // --- END OF CORRECTION ---
  }
};

export const getHistory = async ({ page = 1, limit = 10 } = {}) => { // Add `= {}` here
  const token = getAuthToken();
  if (!token) {
    console.warn("No auth token found for getHistory");
    throw new Error("User not authenticated. Please log in.");
  }

  const skip = (page - 1) * limit;
  const queryParams = `?skip=${skip}&limit=${limit}`;

  try {
    const response = await fetch(`${API_BASE_URL}/prompts/history${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { detail: response.statusText };
      }
      const error = new Error(errorData.detail || `API request failed with status ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error("Error calling getHistory API:", error.data || error.message);
    throw error;
  }
};