import { Link } from "react-router-dom";

function RecentOrders() {
  return (
    <div className="recent-orders">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Recent Orders</h2>
        <Link to="/orders" className="view-all-link" style={{ fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
          View All Orders &rarr;
        </Link>
      </div>

      <div className="order-item">
        <div>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>MacBook Pro</h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Order #ORD-100245</p>
        </div>

        <span className="status delivered" style={{ margin: 0 }}>Delivered</span>

        <Link to="/orders" className="btn btn--primary" style={{ textDecoration: "none", fontSize: "13px", padding: "8px 16px", borderRadius: "8px" }}>
          View Details
        </Link>
      </div>
    </div>
  );
}

export default RecentOrders;
