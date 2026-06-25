import { Link } from "react-router-dom";

function WishlistSummary({ wishlist }) {
  return (
    <div className="wishlist-summary" style={{ background: "white", padding: "24px", borderRadius: "18px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: "0 0 10px 0" }}>Summary</h2>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "600", color: "#475569", borderBottom: "1.5px solid #f1f5f9", paddingBottom: "15px", marginBottom: "10px" }}>
        <span>Products:</span>
        <span style={{ color: "#0f172a", fontWeight: "700" }}>{wishlist.length}</span>
      </div>

      <Link to="/products" className="btn btn--primary" style={{ display: "block", textDecoration: "none", textAlign: "center", width: "100%", padding: "14px" }}>
        Continue Shopping
      </Link>
    </div>
  );
}

export default WishlistSummary;
