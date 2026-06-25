import React from "react";

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const subtotal = order.price * order.quantity;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  // Status timeline steps helper
  const getTimelineSteps = () => {
    if (order.status === "Cancelled") {
      return [
        { label: "Ordered Placed", date: order.orderDate, done: true },
        { label: "Cancelled", date: "Update: Cancelled", done: true, error: true },
      ];
    }

    const steps = [
      { label: "Order Placed", date: order.orderDate, done: true },
      { label: "Processed", date: "System Processed", done: false },
      { label: "Shipped", date: "In Transit", done: false },
      { label: "Delivered", date: "Delivered", done: false },
    ];

    if (order.status === "Pending") {
      steps[1].done = true; // Placed & Processed
    } else if (order.status === "Shipped") {
      steps[1].done = true;
      steps[2].done = true;
    } else if (order.status === "Delivered") {
      steps[1].done = true;
      steps[2].done = true;
      steps[3].done = true;
    }

    return steps;
  };

  const steps = getTimelineSteps();

  return (
    <div className="cart-modal-backdrop" onClick={onClose}>
      <div className="cart-modal-content" style={{ maxWidth: "550px", height: "auto", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-modal-header">
          <div>
            <h2 style={{ margin: 0, fontSize: "18px" }}>Order Details</h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>ID: {order.id}</p>
          </div>
          <button className="cart-modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* Body */}
        <div className="cart-modal-body" style={{ display: "flex", flexDirection: "column", gap: "25px", padding: "20px 24px" }}>
          
          {/* Status Timeline */}
          <div>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Track Status</h4>
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", padding: "0 10px" }}>
              {/* Connector line behind circles */}
              <div style={{
                position: "absolute",
                top: "15px",
                left: "40px",
                right: "40px",
                height: "3px",
                background: "#e2e8f0",
                zIndex: 1
              }}>
                <div style={{
                  height: "100%",
                  width: order.status === "Delivered" ? "100%" : order.status === "Shipped" ? "66%" : order.status === "Pending" ? "33%" : "0%",
                  background: order.status === "Cancelled" ? "#ef4444" : "#7c3aed",
                  transition: "width 0.3s ease"
                }} />
              </div>

              {steps.map((step, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1, textAlign: "center" }}>
                  <div style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: step.done ? (step.error ? "#fee2e2" : "#faf5ff") : "#ffffff",
                    border: `2px solid ${step.done ? (step.error ? "#ef4444" : "#7c3aed") : "#cbd5e1"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: step.done ? (step.error ? "#ef4444" : "#7c3aed") : "#94a3b8",
                    fontSize: "12px",
                    marginBottom: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                  }}>
                    {step.done ? (step.error ? "✕" : "✓") : idx + 1}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: step.done ? "#0f172a" : "#64748b" }}>{step.label}</span>
                  <span style={{ fontSize: "9px", color: "#94a3b8", marginTop: "2px" }}>{step.date}</span>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid #f1f5f9", margin: 0 }} />

          {/* Product Info */}
          <div>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Item Purchased</h4>
            <div style={{ display: "flex", gap: "16px", background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
              <img src={order.image} alt={order.productName} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "10px", background: "#ffffff", border: "1px solid #e2e8f0" }} />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.5px" }}>{order.brand}</span>
                <h4 style={{ margin: "2px 0 6px 0", fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>{order.productName}</h4>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Qty: {order.quantity} &times; ₹{order.price.toLocaleString()}</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>₹{subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid #f1f5f9", margin: 0 }} />

          {/* Address & Payment Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Shipping Address</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#0f172a", fontWeight: "600" }}>John Doe</p>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#475569", lineHeight: "1.4" }}>
                123 Luxury Lane, Suite 456<br />
                Mumbai, MH 400001
              </p>
            </div>
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Payment Method</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#0f172a", fontWeight: "600" }}>Credit Card</p>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#475569" }}>Visa ending in 4242</p>
            </div>
          </div>

        </div>

        {/* Footer with Cost Breakdown */}
        <div className="cart-modal-footer" style={{ padding: "20px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
              <span>Shipping</span>
              <span style={{ color: "#16a34a", fontWeight: "600" }}>FREE</span>
            </div>
            <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              <span>Total Amount</span>
              <span style={{ color: "#7c3aed", fontSize: "20px", fontWeight: "800" }}>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetailsModal;
