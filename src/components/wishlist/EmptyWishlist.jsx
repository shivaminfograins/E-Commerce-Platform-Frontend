import { Link } from "react-router-dom";

function EmptyWishlist() {
  return (
    <div className="wishlist-empty" style={{ textAlign: "center", padding: "60px 20px" }}>
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
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <h2>Your wishlist is empty</h2>
      <p style={{ color: "#64748b", marginBottom: "30px" }}>Save your favorite products here to check out later.</p>
      <Link to="/products" className="btn btn--primary" style={{ display: "inline-flex", textDecoration: "none" }}>
        Discover Products
      </Link>
    </div>
  );
}

export default EmptyWishlist;
