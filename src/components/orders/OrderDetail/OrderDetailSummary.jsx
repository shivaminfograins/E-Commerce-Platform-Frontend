import React from "react";

function OrderDetailSummary({ order, cancelling, onCancelOrder }) {
  if (!order) return null;

  const isPaid = order.payment_status === "paid";
  const isCancellable = order.is_cancellable;
  const isDelivered = order.status === "delivered";

  // Mock estimated delivery (usually 4 days after placement)
  const orderDate = new Date(order.created_at);
  const estDeliveryDate = new Date(orderDate);
  estDeliveryDate.setDate(orderDate.getDate() + 4);
  const estDeliveryStr = estDeliveryDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getPaidDate = () => {
    if (isPaid) {
      return orderDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return "Pending Payment";
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
      {/* Shipping Address */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Delivery Address
          </h3>
          <span style={{ fontSize: "11px", fontWeight: "700", background: "#f1f5f9", color: "#475569", padding: "4px 8px", borderRadius: "6px" }}>
            HOME
          </span>
        </div>
        <p style={{ margin: 0, fontSize: "15px", color: "#0f172a", fontWeight: "700" }}>
          {order.snapshot_full_name}
        </p>
        <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>
          {order.snapshot_address_line_1}
          {order.snapshot_address_line_2 && <><br />{order.snapshot_address_line_2}</>}
          {order.snapshot_landmark && (
            <>
              <br />
              <span style={{ color: "#64748b" }}>Landmark:</span> {order.snapshot_landmark}
            </>
          )}
          <br />
          {order.snapshot_city}, {order.snapshot_state} – {order.snapshot_postal_code}
          <br />
          <span style={{ fontWeight: "500" }}>{order.snapshot_country}</span>
        </p>
        <p style={{ margin: "12px 0 0 0", fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>
          📞 {order.snapshot_phone}
        </p>
      </div>

      {/* Payment Information */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Payment Details
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
            <span style={{ color: "#64748b" }}>Method:</span>
            <span style={{ fontWeight: "600", color: "#0f172a" }}>{order.payment_method_display}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", alignItems: "center" }}>
            <span style={{ color: "#64748b" }}>Status:</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                padding: "4px 8px",
                borderRadius: "6px",
                background: isPaid ? "#d1fae5" : "#fee2e2",
                color: isPaid ? "#065f46" : "#991b1b",
              }}
            >
              {order.payment_status_display}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
            <span style={{ color: "#64748b" }}>Transaction ID:</span>
            <span style={{ fontWeight: "500", color: "#475569", fontFamily: "monospace" }}>
              {order.payment_id || "N/A"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
            <span style={{ color: "#64748b" }}>Paid Date:</span>
            <span style={{ fontWeight: "600", color: "#0f172a" }}>{getPaidDate()}</span>
          </div>
        </div>
      </div>

      {/* General Order Information & Action Buttons */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Shipment Information
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Estimated Delivery:</span>
              <span style={{ fontWeight: "600", color: "#0f172a" }}>{estDeliveryStr}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Courier Partner:</span>
              <span style={{ fontWeight: "600", color: "#0f172a" }}>ShopEase Express</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Tracking Number:</span>
              <span style={{ fontWeight: "500", color: "#475569", fontFamily: "monospace" }}>
                {order.order_number ? `SE-${order.order_number}-TRK` : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "24px" }}>
          {!isDelivered && order.status !== "cancelled" && (
            <button
              onClick={() => alert(`Tracking details details are updated in real-time. Current status is ${order.status_display}`)}
              style={{
                background: "#4f46e5",
                color: "#ffffff",
                border: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4338ca")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#4f46e5")}
            >
              Track Shipment
            </button>
          )}

          {isCancellable && (
            <button
              disabled={cancelling}
              onClick={onCancelOrder}
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                border: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fecaca")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}

          {isDelivered && (
            <button
              onClick={() => alert("Return order process initialized. Our delivery executive will pick it up soon.")}
              style={{
                background: "#f1f5f9",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                padding: "10px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            >
              Return Order
            </button>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => alert("Connecting with Support team via chat. Please wait...")}
              style={{
                flex: 1,
                background: "#ffffff",
                color: "#475569",
                border: "1px solid #cbd5e1",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
            >
              Contact Support
            </button>
            <button
              onClick={() => alert("FAQ and Help Desk opened in a new tab.")}
              style={{
                flex: 1,
                background: "#ffffff",
                color: "#475569",
                border: "1px solid #cbd5e1",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
            >
              Need Help?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailSummary;
