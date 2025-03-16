import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

const GoogleAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the 'code' query parameter from the URL
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code) {
      // Call your backend endpoint to process the code
      axiosInstance.get(`/auth/google/callback?code=${code}`)
        .then(response => {
          toast.success("Google login successful!");
          // Optionally store token if returned by backend (e.g., in localStorage)
          if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
          }
          // Redirect to the dashboard page
          navigate("/dashboard");
        })
        .catch(error => {
          console.error("Google login error:", error.response?.data || error);
          toast.error(error.response?.data?.message || "Google login failed.");
        });
    } else {
      toast.error("Authorization code not found.");
    }
  }, [location, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <p>Processing Google authentication...</p>
    </div>
  );
};

export default GoogleAuthCallback;
