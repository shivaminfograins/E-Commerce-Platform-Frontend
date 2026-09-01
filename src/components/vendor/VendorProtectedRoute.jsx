import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import vendorService from "../../services/vendorService";

function VendorProtectedRoute({ children, user }) {
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const profile = await vendorService.getVendorProfile();
        setVendorProfile(profile);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #f3f3f3", borderTop: "4px solid #7c3aed", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontWeight: "600" }}>Verifying Seller Account...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !vendorProfile) {
    return <Navigate to="/become-seller" replace />;
  }

  const status = vendorProfile.status;

  if (status === "PENDING" || status === "REJECTED") {
    return <Navigate to="/become-seller" replace />;
  }

  if (status === "SUSPENDED") {
    return <Navigate to="/vendor/suspended" replace />;
  }

  if (status === "APPROVED") {
    return children;
  }

  return <Navigate to="/become-seller" replace />;
}

export default VendorProtectedRoute;
