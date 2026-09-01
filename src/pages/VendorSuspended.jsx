import React from "react";
import { Link } from "react-router-dom";

function VendorSuspended() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ background: "#ffffff", padding: "40px", borderRadius: "20px", border: "1px solid #f87171", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", maxWidth: "480px", textAlign: "center" }}>
        <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>⚠️</span>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#dc2626", margin: "0 0 12px 0" }}>Seller Account Suspended</h1>
        <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0" }}>
          Your seller privileges have been suspended due to policy violations or review guidelines. Please contact store platform administration to resolve this issue.
        </p>
        <Link to="/" style={{ display: "inline-block", background: "#3b82f6", color: "white", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontWeight: "600", transition: "background 0.2s" }}>
          Go back Home
        </Link>
      </div>
    </div>
  );
}

export default VendorSuspended;
