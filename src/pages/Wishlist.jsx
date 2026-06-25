import MainLayout from "../layouts/MainLayout";

import WishlistList from "../components/wishlist/WishlistList";

import WishlistSummary from "../components/wishlist/WishlistSummary";

import EmptyWishlist from "../components/wishlist/EmptyWishlist";

import products from "../data/products";

function Wishlist({ cart, setCart, wishlist = [], setWishlist, user, setUser }) {
  const wishlistedProducts = products.filter((product) => wishlist.includes(product.id));

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  const handleRemove = (productId) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const handleAddToCart = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    // Remove from wishlist after adding to cart
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  return (
    <MainLayout cartCount={cartCount} wishlistCount={wishlist.length} user={user} setUser={setUser}>
      <div className="container">
        <div className="page-header" style={{ margin: "40px 0" }}>
          <h1>❤️ My Wishlist</h1>

          <p>{wishlistedProducts.length} Items Saved</p>
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="wishlist-page-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "30px", alignItems: "start" }}>
            <WishlistList wishlist={wishlistedProducts} onRemove={handleRemove} onAddToCart={handleAddToCart} />

            <WishlistSummary wishlist={wishlistedProducts} />
          </div>
        ) : (
          <EmptyWishlist />
        )}
      </div>
    </MainLayout>
  );
}

export default Wishlist;
