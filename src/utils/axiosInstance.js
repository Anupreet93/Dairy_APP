import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081",  // Ensure this is your backend URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🔹 Token being sent:", token);  // Debugging log

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found. User may not be logged in.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle Unauthorized (401) errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - Redirecting to login...");
      localStorage.removeItem("token");  // Clear invalid token
      window.location.href = "/login";  // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
