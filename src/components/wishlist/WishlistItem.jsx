function WishlistItem({ item, onRemove, onAddToCart }) {
  return (
    <div className="wishlist-item" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "16px", background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
      <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" }} />

      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: "0 0 4px 0" }}>{item.name}</h3>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{item.brand}</p>
      </div>

      <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 30px" }}>₹{item.price.toLocaleString()}</h3>

      <div className="wishlist-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button className="btn btn--primary" onClick={() => onAddToCart && onAddToCart(item)}>Add To Cart</button>

        <button className="remove-btn" onClick={() => onRemove && onRemove(item.id)} style={{ padding: "10px 18px", border: "1px solid #cbd5e1", background: "none", color: "#64748b", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "all 0.2s" }}>Remove</button>
      </div>
    </div>
  );
}

export default WishlistItem;
