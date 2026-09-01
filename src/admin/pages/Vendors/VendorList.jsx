import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import vendorService from "../../../services/vendorService";

function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVendors();
  }, [statusFilter, searchQuery]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorService.getAdminVendors({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      });
      setVendors(data);
    } catch (err) {
      setError("Failed to load vendor applications.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "#16a34a";
      case "PENDING": return "#d97706";
      case "REJECTED": return "#dc2626";
      case "SUSPENDED": return "#7f1d1d";
      default: return "#475569";
    }
  };

  return (
    <div style={{ padding: "30px", background: "white", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Vendor Applications</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px" }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", background: "white" }}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {error && <div style={{ color: "#b91c1c", marginBottom: "20px" }}>{error}</div>}

      {loading ? (
        <p>Loading applications...</p>
      ) : vendors.length === 0 ? (
        <p style={{ color: "#64748b" }}>No applications found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#475569", fontWeight: "700" }}>
              <th style={{ padding: "12px 16px" }}>Store Name</th>
              <th style={{ padding: "12px 16px" }}>Business Name</th>
              <th style={{ padding: "12px 16px" }}>Email</th>
              <th style={{ padding: "12px 16px" }}>Phone</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "16px", fontWeight: "600", color: "#0f172a" }}>{vendor.store_name}</td>
                <td style={{ padding: "16px", color: "#475569" }}>{vendor.business_name}</td>
                <td style={{ padding: "16px", color: "#475569" }}>{vendor.business_email}</td>
                <td style={{ padding: "16px", color: "#475569" }}>{vendor.business_phone}</td>
                <td style={{ padding: "16px" }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "100px",
                    fontSize: "12px",
                    fontWeight: "700",
                    background: getStatusColor(vendor.status) + "15",
                    color: getStatusColor(vendor.status)
                  }}>
                    {vendor.status}
                  </span>
                </td>
                <td style={{ padding: "16px" }}>
                  <Link to={`/admin/vendors/${vendor.id}`} style={{
                    color: "#7c3aed",
                    fontWeight: "600",
                    textDecoration: "none",
                    fontSize: "14px"
                  }}>
                    Review &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VendorList;
