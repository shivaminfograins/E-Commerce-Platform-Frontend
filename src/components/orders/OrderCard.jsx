function OrderCard({ order, onViewDetails }) {
  return (
    <div className="order-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
      <div className="order-image" style={{ width: "80px", height: "80px", overflow: "hidden", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={order.image} alt={order.productName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
      </div>

      <div className="order-info" style={{ flex: 1, marginLeft: "20px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.5px" }}>{order.brand}</span>
        <h3 style={{ margin: "2px 0 6px 0", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>Order #{order.orderNumber}</h3>
        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Date: {order.date}</p>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>Items: {order.itemCount}</p>
      </div>

      <div className="order-price" style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginRight: "30px" }}>
        ₹{Number(order.total).toLocaleString()}
      </div>

      <div className="order-action" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
        <span className={`status status--${order.rawStatus}`} style={{ 
          fontSize: "12px", 
          fontWeight: "700", 
          padding: "6px 12px", 
          borderRadius: "100px",
          textTransform: "capitalize",
          background: order.rawStatus === "delivered" ? "#d1fae5" : order.rawStatus === "cancelled" ? "#fee2e2" : "#fef3c7",
          color: order.rawStatus === "delivered" ? "#065f46" : order.rawStatus === "cancelled" ? "#991b1b" : "#92400e"
        }}>
          {order.status}
        </span>

        <button className="btn btn--primary" style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }} onClick={() => onViewDetails && onViewDetails(order)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
