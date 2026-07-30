import React from "react";
import { useNavigate } from "react-router-dom";

function OrderDetailHeader({ order, onPrintInvoice, onDownloadPDF }) {
  const navigate = useNavigate();

  const formattedDate = order
    ? new Date(order.created_at).toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const getStatusColors = (status) => {
    switch (status) {
      case "delivered":
        return { bg: "#e6f4ea", text: "#137333", border: "#ceead6" };
      case "cancelled":
      case "refunded":
        return { bg: "#fce8e6", text: "#c5221f", border: "#fad2cf" };
      case "shipped":
        return { bg: "#e8f0fe", text: "#1a73e8", border: "#d2e3fc" };
      case "pending":
      case "confirmed":
      case "packed":
      default:
        return { bg: "#fef7e0", text: "#b06000", border: "#feebc8" };
    }
  };

  const statusStyle = order ? getStatusColors(order.status) : { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };

  return (
    <div
      className="order-detail-header-print-hidden"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {/* Top Breadcrumb / Navigation */}
      <button
        onClick={() => navigate("/orders")}
        style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          color: "#4f46e5",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          padding: "4px 0",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(-4px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      >
        &larr; Back to My Orders
      </button>

      {/* Main Header Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          padding: "24px",
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>
              Order #{order?.order_number}
            </h1>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                padding: "6px 12px",
                borderRadius: "9999px",
                textTransform: "capitalize",
                background: statusStyle.bg,
                color: statusStyle.text,
                border: `1px solid ${statusStyle.border}`,
                display: "inline-block",
              }}
            >
              {order?.status_display}
            </span>
          </div>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#64748b" }}>
            Placed on <span style={{ fontWeight: "600", color: "#334155" }}>{formattedDate}</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={onDownloadPDF}
            style={{
              background: "#4f46e5",
              color: "#ffffff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4338ca";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#4f46e5";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4a2 2 0 0 1 2-2h14"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Tax Invoice
          </button>

          <button
            onClick={onPrintInvoice}
            style={{
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = "#94a3b8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Preview
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailHeader;
