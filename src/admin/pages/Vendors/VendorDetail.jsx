import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import vendorService from "../../../services/vendorService";

function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchVendorDetail();
  }, [id]);

  const fetchVendorDetail = async () => {
    setLoading(true);
    try {
      const data = await vendorService.getAdminVendorDetail(id);
      setVendor(data);
    } catch (err) {
      setError("Failed to load vendor application details.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this vendor? This will enable selling features for their user account.")) return;
    setActionLoading(true);
    try {
      await vendorService.approveVendor(id);
      fetchVendorDetail();
    } catch (err) {
      setError(err.response?.data?.detail || "Approve action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectReason) return;
    setActionLoading(true);
    try {
      await vendorService.rejectVendor(id, rejectReason);
      setShowRejectModal(false);
      fetchVendorDetail();
    } catch (err) {
      setError(err.response?.data?.detail || "Reject action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p style={{ padding: "30px" }}>Loading application details...</p>;
  if (error && !vendor) return <div style={{ color: "#b91c1c", padding: "30px" }}>{error}</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* Back button */}
      <button onClick={() => navigate("/admin/vendors")} style={{
        background: "none",
        border: "none",
        color: "#64748b",
        fontWeight: "600",
        cursor: "pointer",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "6px"
      }}>
        &larr; Back to Applications
      </button>

      {error && (
        <div style={{ padding: "16px 20px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: "12px", marginBottom: "30px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Main card */}
      <div style={{ background: "white", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9" }}>
        
        {/* Header section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "35px", borderBottom: "1px solid #f1f5f9", paddingBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>{vendor.business_name}</h1>
            <span style={{ fontSize: "15px", color: "#64748b" }}>Store Name: <strong>{vendor.store_name}</strong></span>
          </div>
          <span style={{
            padding: "6px 14px",
            borderRadius: "100px",
            fontSize: "13px",
            fontWeight: "700",
            background: vendor.status === "APPROVED" ? "#dcfce7" : vendor.status === "PENDING" ? "#fef3c7" : "#fee2e2",
            color: vendor.status === "APPROVED" ? "#16a34a" : vendor.status === "PENDING" ? "#d97706" : "#dc2626"
          }}>
            {vendor.status}
          </span>
        </div>

        {/* Business details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>Contact Details</h3>
            <p style={{ margin: "8px 0" }}><strong>Email:</strong> {vendor.business_email}</p>
            <p style={{ margin: "8px 0" }}><strong>Phone:</strong> {vendor.business_phone}</p>
            <p style={{ margin: "8px 0" }}><strong>User ID:</strong> {vendor.user}</p>
          </div>

          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>Address Details</h3>
            {vendor.addresses && vendor.addresses[0] ? (
              <div>
                <p style={{ margin: "4px 0" }}><strong>Type:</strong> {vendor.addresses[0].address_type}</p>
                <p style={{ margin: "4px 0" }}>{vendor.addresses[0].full_name} ({vendor.addresses[0].phone})</p>
                <p style={{ margin: "4px 0" }}>{vendor.addresses[0].address_line_1}, {vendor.addresses[0].address_line_2}</p>
                <p style={{ margin: "4px 0" }}>{vendor.addresses[0].city}, {vendor.addresses[0].state} - {vendor.addresses[0].postal_code}</p>
              </div>
            ) : (
              <p style={{ color: "#64748b" }}>No address provided</p>
            )}
          </div>
        </div>

        {/* Financial bank account */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>Bank Settlement Account</h3>
          {vendor.bank_account ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <p style={{ margin: "4px 0" }}><strong>Holder Name:</strong> {vendor.bank_account.account_holder_name}</p>
              <p style={{ margin: "4px 0" }}><strong>Account Number:</strong> {vendor.bank_account.account_number}</p>
              <p style={{ margin: "4px 0" }}><strong>Bank Name:</strong> {vendor.bank_account.bank_name}</p>
              <p style={{ margin: "4px 0" }}><strong>Branch Name:</strong> {vendor.bank_account.branch_name}</p>
              <p style={{ margin: "4px 0" }}><strong>IFSC Code:</strong> {vendor.bank_account.ifsc_code}</p>
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>No bank details provided</p>
          )}
        </div>

        {/* Verification Documents list */}
        <div style={{ marginBottom: "45px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>Verification Documents</h3>
          {vendor.documents && vendor.documents.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {vendor.documents.map((doc) => (
                <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div>
                    <span style={{ fontWeight: "700", color: "#334155" }}>{doc.document_type}</span>
                    <span style={{ fontSize: "13px", color: "#64748b", marginLeft: "15px" }}>Number: {doc.document_number || "N/A"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: doc.verification_status === "APPROVED" ? "#16a34a" : "#d97706" }}>
                      {doc.verification_status}
                    </span>
                    <a href={doc.download_url} target="_blank" rel="noreferrer" style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      background: "white",
                      border: "1px solid #cbd5e1",
                      color: "#475569",
                      fontWeight: "600",
                      fontSize: "13px",
                      textDecoration: "none"
                    }}>
                      View File
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>No documents uploaded</p>
          )}
        </div>

        {/* Action Controls */}
        {vendor.status === "PENDING" && (
          <div style={{ display: "flex", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "30px" }}>
            <button onClick={handleApprove} disabled={actionLoading} style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "#16a34a",
              color: "white",
              border: "none",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              opacity: actionLoading ? 0.7 : 1
            }}>
              Approve Vendor
            </button>
            <button onClick={() => setShowRejectModal(true)} disabled={actionLoading} style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "#dc2626",
              color: "white",
              border: "none",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              opacity: actionLoading ? 0.7 : 1
            }}>
              Reject Vendor
            </button>
          </div>
        )}

      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <form onSubmit={handleReject} style={{ background: "white", padding: "35px", borderRadius: "20px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>Reject Vendor Application</h3>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#475569" }}>Reason for Rejection</label>
            <textarea
              required
              rows="4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide a clear explanation for the applicant..."
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", marginBottom: "24px" }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" disabled={actionLoading} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "#dc2626", color: "white", border: "none", fontWeight: "600", cursor: "pointer" }}>Confirm Rejection</button>
              <button type="button" onClick={() => setShowRejectModal(false)} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "none", border: "1px solid #cbd5e1", color: "#475569", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default VendorDetail;
