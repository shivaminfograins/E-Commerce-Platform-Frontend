import { Link } from "react-router-dom";

function EmptyOrders() {
  return (
    <div className="orders-empty" style={{ textAlign: "center", padding: "60px 20px" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: "20px" }}
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
      <h2>No orders found</h2>
      <p style={{ color: "#64748b", marginBottom: "30px", maxWidth: "450px", margin: "0 auto 30px" }}>
        We couldn't find any orders matching your search query or status filter. Try resetting your criteria or explore our shop.
      </p>
      <Link to="/products" className="btn btn--primary" style={{ display: "inline-flex", textDecoration: "none" }}>
        Discover Products
      </Link>
    </div>
  );
}

export default EmptyOrders;