import React from "react";
import { useNavigate } from "react-router-dom";

function OrderDetailItems({ order, onBuyAgain }) {
  const navigate = useNavigate();
  if (!order || !order.items) return null;

  const isDelivered = order.status === "delivered";

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
        Items in your order
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {order.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: "20px",
              paddingBottom: "20px",
              borderBottom: "1px solid #f1f5f9",
              flexWrap: "wrap",
            }}
          >
            {/* Image */}
            <div
              onClick={() => navigate(`/product/${item.product_id}`)}
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                cursor: "pointer",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.product_image ? (
                <img src={item.product_image} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "24px" }}>📦</span>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              <h4
                onClick={() => navigate(`/product/${item.product_id}`)}
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#0f172a",
                  cursor: "pointer",
                  lineHeight: "1.4",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4f46e5")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#0f172a")}
              >
                {item.product_name}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "13px", color: "#64748b" }}>
                {item.variant_name && (
                  <span>
                    Variant: <strong style={{ color: "#475569" }}>{item.variant_name}</strong>
                  </span>
                )}
                {item.sku && (
                  <span>
                    SKU: <code style={{ color: "#475569", fontFamily: "monospace" }}>{item.sku}</code>
                  </span>
                )}
                <span>
                  Seller: <strong style={{ color: "#475569" }}>ShopEase Certified Seller</strong>
                </span>
              </div>

              {/* Price & Qty breakdown */}
              <div style={{ display: "flex", gap: "24px", marginTop: "12px", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#94a3b8", display: "block" }}>Unit Price</span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                    ₹{Number(item.price).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#94a3b8", display: "block" }}>Quantity</span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>{item.quantity}</span>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#94a3b8", display: "block" }}>Total</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                    ₹{Number(item.total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Item */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                justifyContent: "center",
                minWidth: "140px",
              }}
            >
              {isDelivered && (
                <>
                  <button
                    onClick={() => onBuyAgain(item.variant_id)}
                    style={{
                      background: "#4f46e5",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#4338ca")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#4f46e5")}
                  >
                    Buy Again
                  </button>
                  <button
                    onClick={() => navigate(`/product/${item.product_id}?writeReview=true`)}
                    style={{
                      background: "#ffffff",
                      color: "#4f46e5",
                      border: "1px solid #4f46e5",
                      padding: "7px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#faf5ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ffffff";
                    }}
                  >
                    Write Review
                  </button>
                </>
              )}
              <button
                onClick={() => navigate(`/product/${item.product_id}`)}
                style={{
                  background: "#ffffff",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  padding: "7px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
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
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetailItems;
