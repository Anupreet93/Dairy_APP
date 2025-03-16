import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({ Component }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  if (!isAuthenticated) {
    toast.error("Please log in to access this page.");
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;