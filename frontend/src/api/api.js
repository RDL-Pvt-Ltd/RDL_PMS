import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Backend URL

// Function to get the auth token from local storage
const getAuthToken = () => {
  return localStorage.getItem("token"); // Assuming token is stored in localStorage
};

export const addUser = async (userData) => {
  try {
    const token = getAuthToken();
    if (!token) throw { message: "Unauthorized: No token provided" };

    const response = await axios.post(`${API_URL}/add-user`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/`, userData);
    
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Store token after login
      localStorage.setItem("role", response.data.role); // Store role for dashboard redirection
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};
