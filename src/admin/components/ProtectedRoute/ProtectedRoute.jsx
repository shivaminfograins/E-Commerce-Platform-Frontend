import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Loader from "../Loader/Loader";

function ProtectedRoute({ children }) {
  const { adminUser, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!adminUser) {
    // Redirect to login page and save the state to redirect back if needed
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
