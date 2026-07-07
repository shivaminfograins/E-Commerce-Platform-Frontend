import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService";

function RecentOrders() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await orderService.getOrders({ page: 1, page_size: 3 });
        if (response.data.success) {
          setRecentOrders(response.data.results);
        }
      } catch (err) {
        console.error("Failed to load recent orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="recent-orders" style={{ marginTop: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>Recent Orders</h2>
        {recentOrders.length > 0 && (
          <Link to="/orders" className="view-all-link" style={{ fontSize: "14px", fontWeight: "600", color: "#7c3aed", textDecoration: "none" }}>
            View All Orders &rarr;
          </Link>
        )}
      </div>

      {loading ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>Loading recent orders...</p>
      ) : recentOrders.length === 0 ? (
        <div style={{ padding: "30px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9", textAlign: "center" }}>
          <p style={{ margin: "0 0 12px 0", color: "#64748b", fontSize: "14px" }}>You haven't placed any orders yet.</p>
          <Link to="/" style={{ color: "#7c3aed", fontWeight: "700", textDecoration: "none", fontSize: "14px" }}>Start Shopping &rarr;</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="order-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#ffffff",
                border: "1px solid #f1f5f9",
                borderRadius: "16px",
                padding: "16px 20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.01)"
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>
                  {order.items?.[0]?.product_name || "Order Purchase"} {order.item_count > 1 ? `(+${order.item_count - 1} more)` : ""}
                </h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Order #{order.order_number}</p>
                <p style={{ margin: "4px 0 0 0", color: "#0f172a", fontSize: "14px", fontWeight: "700" }}>₹{Number(order.total_amount).toLocaleString()}</p>
              </div>

              <span
                className={`status status--${order.status}`}
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "100px",
                  textTransform: "capitalize",
                  background: order.status === "delivered" ? "#d1fae5" : order.status === "cancelled" ? "#fee2e2" : "#fef3c7",
                  color: order.status === "delivered" ? "#065f46" : order.status === "cancelled" ? "#991b1b" : "#92400e"
                }}
              >
                {order.status_display}
              </span>

              <Link
                to="/orders"
                className="btn btn--primary"
                style={{
                  textDecoration: "none",
                  fontSize: "13px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "600"
                }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentOrders;
