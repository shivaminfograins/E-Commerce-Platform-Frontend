import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import WishlistList from "../components/wishlist/WishlistList";
import WishlistSummary from "../components/wishlist/WishlistSummary";
import EmptyWishlist from "../components/wishlist/EmptyWishlist";
import api from "../api/axios";
import cartService from "../services/cartService";

function Wishlist({ cart, setCart, wishlist = [], setWishlist, user, setUser }) {
  const navigate = useNavigate();
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMediaUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseURL = api.defaults.baseURL || "http://127.0.0.1:8000/api";
    const origin = baseURL.replace(/\/api\/?$/, "");
    return `${origin}${path}`;
  };

  const mapBackendProductToWishlistItem = (product) => {
    const defaultVariant = product.variants?.find((v) => v.is_active && v.stock > 0) || product.variants?.[0];
    const hasImage = product.images && product.images.length > 0;
    const imageUrl = hasImage ? getMediaUrl(product.images[0].image) : "";
    const basePrice = defaultVariant ? parseFloat(defaultVariant.price) : 0;

    return {
      id: product.id,
      name: product.name,
      brand: "ShopEase",
      price: basePrice,
      image: imageUrl,
      variantId: defaultVariant?.id
    };
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await api.get("/wishlist/");
          const productsData = response.data.map(item => mapBackendProductToWishlistItem(item.product));
          setWishlistedProducts(productsData);
        } catch (e) {
          console.error("Failed to fetch wishlist details:", e);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlistedProducts([]);
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  const handleRemove = (productId) => {
    setWishlist(productId);
    setWishlistedProducts(prev => prev.filter(item => item.id !== productId));
  };

  const handleAddToCart = async (item) => {
    if (!item.variantId) {
      // Fallback: If no variant found, redirect to detail page
      navigate(`/product/${item.id}`);
      return;
    }
    
    try {
      const response = await cartService.addToCart(item.variantId, 1);
      // Update global cart state
      setCart(response.data);
      // Remove from wishlist
      setWishlist(item.id);
      setWishlistedProducts(prev => prev.filter(wishItem => wishItem.id !== item.id));
    } catch (err) {
      console.error("Failed to add wishlisted item to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <MainLayout cartCount={cartCount} wishlistCount={wishlist.length} user={user} setUser={setUser}>
      <div className="container">
        <div className="page-header" style={{ margin: "40px 0" }}>
          <h1>❤️ My Wishlist</h1>

          <p>{wishlistedProducts.length} Items Saved</p>
        </div>

        {loading ? (
          <p className="section-message">Loading wishlist items...</p>
        ) : wishlistedProducts.length > 0 ? (
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
