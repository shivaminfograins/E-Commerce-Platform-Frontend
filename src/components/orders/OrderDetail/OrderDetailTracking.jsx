import React from "react";

function OrderDetailTracking({ order }) {
  if (!order) return null;

  const vendorOrders = order.vendor_orders || [];

  if (vendorOrders.length === 0) {
    // Single vendor or fallback tracking
    return (
      <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Order Progress</h3>
        <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>Status: <strong>{order.status_display || order.status}</strong></p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>Shipment Tracking ({vendorOrders.length} Vendor Shipments)</h3>
      {vendorOrders.map((vo) => {
        const isCancelled = vo.status === "cancelled";
        const isShipped = vo.status === "shipped" || vo.status === "delivered";
        
        const steps = [
          { key: "confirmed", label: "Confirmed", date: vo.created_at ? new Date(vo.created_at).toLocaleDateString() : "", completed: ["confirmed", "processing", "packed", "shipped", "delivered"].includes(vo.status) },
          { key: "processing", label: "Processing", date: "", completed: ["processing", "packed", "shipped", "delivered"].includes(vo.status) },
          { key: "packed", label: "Packed", date: "", completed: ["packed", "shipped", "delivered"].includes(vo.status) },
          { key: "shipped", label: "Shipped", date: vo.shipped_at ? new Date(vo.shipped_at).toLocaleDateString() : "", completed: ["shipped", "delivered"].includes(vo.status) },
          { key: "delivered", label: "Delivered", date: vo.delivered_at ? new Date(vo.delivered_at).toLocaleDateString() : "", completed: vo.status === "delivered" },
        ];

        return (
          <div key={vo.id || vo.vendor_order_number} style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>{vo.vendor_store_name_snapshot || "Vendor Store"}</h4>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Sub-Order #: {vo.vendor_order_number}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: isCancelled ? "#fee2e2" : isShipped ? "#dcfce7" : "#e0f2fe", color: isCancelled ? "#991b1b" : isShipped ? "#166534" : "#075985" }}>
                  {vo.status_display || vo.status}
                </span>
                {vo.carrier_name && (
                  <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
                    Courier: <strong>{vo.carrier_name}</strong> | Tracking: <strong>{vo.tracking_number}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            {isCancelled ? (
              <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#fef2f2", color: "#991b1b", fontSize: "13px" }}>
                This sub-order was cancelled. Stock has been restored to vendor inventory.
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", position: "relative", marginTop: "16px" }}>
                {steps.map((step, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, textAlign: "center", zIndex: 2 }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: step.completed ? "#2563eb" : "#ffffff", border: `2px solid ${step.completed ? "#2563eb" : "#cbd5e1"}`, color: step.completed ? "#ffffff" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>
                      {step.completed ? "?" : idx + 1}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: step.completed ? "600" : "400", color: step.completed ? "#0f172a" : "#64748b", marginTop: "6px" }}>{step.label}</span>
                    {step.date && <span style={{ fontSize: "10px", color: "#94a3b8" }}>{step.date}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OrderDetailTracking;
