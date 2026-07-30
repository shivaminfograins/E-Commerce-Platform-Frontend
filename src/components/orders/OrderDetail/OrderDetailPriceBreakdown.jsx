import React from "react";

function OrderDetailPriceBreakdown({ order }) {
  if (!order) return null;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
        Price details
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
          <span>Subtotal</span>
          <span style={{ fontWeight: "600", color: "#334155" }}>₹{Number(order.subtotal).toLocaleString()}</span>
        </div>

        {Number(order.tax) > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
            <span>Tax / GST</span>
            <span style={{ fontWeight: "600", color: "#334155" }}>₹{Number(order.tax).toLocaleString()}</span>
          </div>
        )}

        {Number(order.discount) > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#ef4444" }}>
            <span>Discount</span>
            <span style={{ fontWeight: "600" }}>-₹{Number(order.discount).toLocaleString()}</span>
          </div>
        )}

        {order.coupon_code && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#16a34a" }}>
            <span>Coupon Discount ({order.coupon_code})</span>
            <span style={{ fontWeight: "600" }}>-₹{Number(order.coupon_discount || 0).toLocaleString()}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
          <span>Shipping Charges</span>
          {Number(order.shipping_charge) === 0 ? (
            <span style={{ color: "#16a34a", fontWeight: "700" }}>FREE</span>
          ) : (
            <span style={{ fontWeight: "600", color: "#334155" }}>
              ₹{Number(order.shipping_charge).toLocaleString()}
            </span>
          )}
        </div>

        <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "8px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
          <span>Grand Total</span>
          <span style={{ color: "#4f46e5", fontSize: "22px" }}>
            ₹{Number(order.total_amount).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPriceBreakdown;
