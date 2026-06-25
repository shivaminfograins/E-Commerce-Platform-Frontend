import WishlistItem from "./WishlistItem";

function WishlistList({ wishlist, onRemove, onAddToCart }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {wishlist.map((item) => (
        <WishlistItem key={item.id} item={item} onRemove={onRemove} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

export default WishlistList;
