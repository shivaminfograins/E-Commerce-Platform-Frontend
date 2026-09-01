import React, { useState, useEffect } from "react";
import vendorService from "../services/vendorService";

function VendorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await vendorService.getVendorDashboardData();
        setData(result);
      } catch (err) {
        setError("Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div style={{ color: "#64748b", fontSize: "15px", fontWeight: "600" }}>Loading dashboard details...</div>;
  }

  if (error) {
    return <div style={{ color: "#ef4444", fontWeight: "600" }}>{error}</div>;
  }

  const memberSince = data.created_at ? new Date(data.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A";

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>Welcome back, {data.store_name}</h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "16px" }}>Manage your vendor workspace account and store profile.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        {/* Card 1: Status */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Store Status</span>
            <span style={{ fontSize: "20px" }}>🛡️</span>
          </div>
          <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#16a34a", margin: 0 }}>{data.status}</h3>
        </div>

        {/* Card 2: Commission Rate */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Commission Rate</span>
            <span style={{ fontSize: "20px" }}>📉</span>
          </div>
          <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{data.commission_rate}%</h3>
        </div>

        {/* Card 3: Member Since */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Member Since</span>
            <span style={{ fontSize: "20px" }}>📅</span>
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{memberSince}</h3>
        </div>
      </div>

      {/* Details Box */}
      <div style={{ background: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>Store Overview</h2>
        <p style={{ color: "#64748b", fontSize: "15px", margin: "0 0 24px 0" }}>Below are your verified vendor legal identity credentials.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <span style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Legal Business Name</span>
            <strong style={{ fontSize: "16px", color: "#334155" }}>{data.business_name}</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Official Store Name</span>
            <strong style={{ fontSize: "16px", color: "#334155" }}>{data.store_name}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
