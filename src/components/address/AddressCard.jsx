import React from "react";

function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  return (
    <div
      className="address-card"
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        border: address.isDefault ? "2px solid #7c3aed" : "1.5px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "200px",
        transition: "all 0.3s ease"
      }}
    >
      {/* Badge Type & Default status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
            background: address.type === "Home" ? "#eff6ff" : "#f0fdf4",
            color: address.type === "Home" ? "#1d4ed8" : "#15803d",
            padding: "4px 10px",
            borderRadius: "30px",
          }}
        >
          {address.type}
        </span>
        {address.isDefault && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              background: "#faf5ff",
              color: "#7c3aed",
              border: "1px solid #d8b4fe",
              padding: "3px 8px",
              borderRadius: "6px",
            }}
          >
            Default
          </span>
        )}
      </div>

      {/* Info details */}
      <div style={{ flexGrow: 1, marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
          {address.fullName}
        </h3>
        <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>
          {address.streetAddress}
        </p>
        <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#475569" }}>
          {address.city}, {address.state} - {address.zipCode}
        </p>
        <p style={{ margin: 0, fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          {address.phone}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => onEdit(address)}
            style={{
              background: "none",
              border: "none",
              color: "#4f46e5",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(address.id)}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            Delete
          </button>
        </div>

        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0
            }}
          >
            Use as Default
          </button>
        )}
      </div>
    </div>
  );
}

export default AddressCard;
