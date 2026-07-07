import { useState, useEffect } from "react";
import orderService from "../../services/orderService";

function OrderDetailsModal({ orderId, onClose, onCancelSuccess }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      const fetchDetail = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await orderService.getOrderDetail(orderId);
          if (response.data.success) {
            setOrder(response.data.order);
          } else {
            setError("Failed to load order details.");
          }
        } catch (err) {
          console.error("Failed to load order:", err);
          setError("Error fetching order details.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [orderId]);

  if (!orderId) return null;

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const response = await orderService.cancelOrder(orderId);
      if (response.data.success) {
        alert("Order cancelled successfully.");
        if (typeof onCancelSuccess === "function") {
          onCancelSuccess();
        }
      } else {
        alert(response.data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error("Cancel failed:", err);
      const msg = err?.response?.data?.message || "Failed to cancel order.";
      alert(msg);
    } finally {
      setCancelling(false);
    }
  };

  // Status timeline steps helper
  const getTimelineSteps = () => {
    if (!order) return [];

    if (order.status === "cancelled") {
      return [
        { label: "Order Placed", date: new Date(order.created_at).toLocaleDateString(), done: true },
        { label: "Cancelled", date: "Cancelled", done: true, error: true },
      ];
    }
    if (order.status === "refunded") {
      return [
        { label: "Order Placed", date: new Date(order.created_at).toLocaleDateString(), done: true },
        { label: "Refunded", date: "Refunded", done: true, error: true },
      ];
    }

    const steps = [
      { label: "Order Placed", date: new Date(order.created_at).toLocaleDateString(), done: true },
      { label: "Confirmed", date: "Processing", done: false },
      { label: "Shipped", date: "In Transit", done: false },
      { label: "Delivered", date: "Delivered", done: false },
    ];

    const currentStatus = order.status;
    if (currentStatus === "pending") {
      // only placed is done
    } else if (currentStatus === "confirmed" || currentStatus === "packed") {
      steps[1].done = true;
    } else if (currentStatus === "shipped") {
      steps[1].done = true;
      steps[2].done = true;
    } else if (currentStatus === "delivered") {
      steps[1].done = true;
      steps[2].done = true;
      steps[3].done = true;
    }

    return steps;
  };

  const steps = getTimelineSteps();

  // Progress line percent
  const getProgressWidth = () => {
    if (!order || order.status === "cancelled" || order.status === "refunded") return "100%";
    if (order.status === "pending") return "0%";
    if (order.status === "confirmed" || order.status === "packed") return "33%";
    if (order.status === "shipped") return "66%";
    if (order.status === "delivered") return "100%";
    return "0%";
  };

  return (
    <div className="cart-modal-backdrop" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", zIndex: 1000, backdropFilter: "blur(4px)" }}>
      <div className="cart-modal-content" style={{ width: "90%", maxWidth: "600px", background: "#ffffff", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-modal-header" style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>Order Details</h2>
            {order && <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>Order #{order.order_number}</p>}
          </div>
          <button className="cart-modal-close" style={{ background: "none", border: "none", fontSize: "28px", color: "#94a3b8", cursor: "pointer" }} onClick={onClose}>&times;</button>
        </div>

        {/* Body */}
        <div className="cart-modal-body" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "25px", padding: "24px" }}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#64748b", margin: "40px 0" }}>Loading order details...</p>
          ) : error ? (
            <p style={{ textAlign: "center", color: "#ef4444", margin: "40px 0" }}>{error}</p>
          ) : order ? (
            <>
              {/* Status Timeline */}
              <div>
                <h4 style={{ margin: "0 0 15px 0", fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "1px" }}>Track Status</h4>
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
                      width: getProgressWidth(),
                      background: order.status === "cancelled" || order.status === "refunded" ? "#ef4444" : "#7c3aed",
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

              {/* Products Info */}
              <div>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "1px" }}>Items Purchased</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {order.items?.map((item) => (
                    <div key={item.id} style={{ display: "flex", gap: "16px", background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                      {item.product_image && (
                        <img src={item.product_image} alt={item.product_name} style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "10px", background: "#ffffff", border: "1px solid #e2e8f0" }} />
                      )}
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                        <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{item.product_name}</h4>
                        {item.variant_name && <span style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Variant: {item.variant_name}</span>}
                        {item.sku && <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>SKU: {item.sku}</span>}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                          <span style={{ fontSize: "13px", color: "#64748b" }}>Qty: {item.quantity} &times; ₹{Number(item.price).toLocaleString()}</span>
                          <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>₹{Number(item.total).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr style={{ border: 0, borderTop: "1px solid #f1f5f9", margin: 0 }} />

              {/* Address & Payment Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Shipping Address</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#0f172a", fontWeight: "600" }}>{order.snapshot_full_name}</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#475569", lineHeight: "1.4" }}>
                    {order.snapshot_address_line_1}
                    {order.snapshot_address_line_2 && <><br />{order.snapshot_address_line_2}</>}
                    {order.snapshot_landmark && <><br />Near: {order.snapshot_landmark}</>}
                    <br />{order.snapshot_city}, {order.snapshot_state} – {order.snapshot_postal_code}
                    <br />{order.snapshot_country}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#475569" }}>📞 {order.snapshot_phone}</p>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Payment Information</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#0f172a", fontWeight: "600" }}>Method: {order.payment_method_display}</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#475569" }}>Status: <strong style={{ color: order.payment_status === "paid" ? "#16a34a" : "#ea580c" }}>{order.payment_status_display}</strong></p>
                  {order.notes && (
                    <div style={{ marginTop: "12px" }}>
                      <h5 style={{ margin: "0 0 4px 0", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Notes</h5>
                      <p style={{ margin: 0, fontSize: "12px", color: "#475569", fontStyle: "italic" }}>{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cancellation Button */}
              {order.is_cancellable && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button
                    disabled={cancelling}
                    onClick={handleCancelOrder}
                    style={{
                      background: "#fee2e2",
                      color: "#b91c1c",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "opacity 0.2s"
                    }}
                  >
                    {cancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer with Cost Breakdown */}
        {order && (
          <div className="cart-modal-footer" style={{ padding: "20px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toLocaleString()}</span>
              </div>
              {Number(order.tax) > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                  <span>Tax / GST</span>
                  <span>₹{Number(order.tax).toLocaleString()}</span>
                </div>
              )}
              {Number(order.discount) > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#ef4444" }}>
                  <span>Discount</span>
                  <span>-₹{Number(order.discount).toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                <span>Shipping</span>
                {Number(order.shipping_charge) === 0 ? (
                  <span style={{ color: "#16a34a", fontWeight: "600" }}>FREE</span>
                ) : (
                  <span>₹{Number(order.shipping_charge).toLocaleString()}</span>
                )}
              </div>
              <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                <span>Total Paid</span>
                <span style={{ color: "#7c3aed", fontSize: "20px", fontWeight: "800" }}>₹{Number(order.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetailsModal;
