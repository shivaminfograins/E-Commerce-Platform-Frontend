import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import CategoryProducts from "./pages/CategoryProducts";
import Products from "./pages/Products";
import TermsAndConditions from "./pages/TermsAndConditions";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnsRefunds from "./pages/ReturnsRefunds";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import AddressBook from "./pages/AddressBook";

import api from "./api/axios";
import cartService from "./services/cartService";

// ---------------------------------------------------------------------------
// App.jsx
//
// Changes from previous version:
//
//  1. updateCartStateFromBackend now reads the NEW backend shape:
//       item.product_id, item.product_name, item.variant_id, item.variant_name,
//       item.sku, item.price, item.stock, item.image, item.quantity, item.subtotal
//
//  2. setCart (the function passed down to child components) now accepts:
//       • a raw backend response.data object  → normalise and apply directly
//       • a legacy function/map form          → kept for backward compat
//
//  3. Cart badge count is derived from cartItems.quantity sum (not a separate
//     `cart` map) because the map was product-keyed and is now variant-keyed.
//
//  4. CartModal onAdd / onRemove now call cartService with variant_id.
//
//  5. After login, the guest cart is automatically merged into the user cart.
//
//  6. The `cart` map is still maintained (variant_id → quantity) for pages
//     that use it to check "is this variant in the cart?" (e.g. ProductCard qty).
// ---------------------------------------------------------------------------

function App() {
  // `cart`      → { [variant_id]: quantity }  (legacy map, kept for compat)
  // `cartItems` → full item objects from the backend
  const [cart, setCartMap] = useState({});
  const [cartItems, setCartItems] = useState([]);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const BACKEND_ORIGIN =
    import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

  const normalizeUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return BACKEND_ORIGIN + url;
    return url;
  };

  // ── Core state updater ────────────────────────────────────────────────────
  /**
   * Apply a backend cart response to local state.
   *
   * Accepts the `response.data` object:
   *   {
   *     cart_items: [ { product_id, product_name, variant_id, variant_name,
   *                     sku, price, stock, image, quantity, subtotal } ],
   *     cart_total,
   *     item_count,
   *     guest_id?
   *   }
   *
   * Also accepts an empty object `{}` to clear the cart (used after order
   * placement or clear-cart).
   */
  const updateCartStateFromBackend = useCallback((data) => {
    // Persist the guest token so axios interceptor can attach it
    if (data.guest_id) {
      localStorage.setItem("guest_id", data.guest_id);
    }

    const items = data.cart_items || [];

    const normalizedItems = items.map((item) => ({
      // CartItem PK (used as React key fallback)
      id: item.id,

      // Product-level
      product_id: item.product_id,
      product_name: item.product_name,

      // Variant-level
      variant_id: item.variant_id,
      variant_name: item.variant_name,
      sku: item.sku,
      price: Number(item.price),
      stock: item.stock,

      // Image — backend returns absolute URL already, but normalise anyway
      image: normalizeUrl(item.image || ""),

      // Cart-specific
      quantity: item.quantity,
      subtotal: Number(item.subtotal ?? (Number(item.price) * item.quantity)),
    }));

    setCartItems(normalizedItems);

    // Rebuild the variant_id → quantity map for legacy consumers
    const newCartMap = {};
    normalizedItems.forEach((item) => {
      newCartMap[item.variant_id] = item.quantity;
    });
    setCartMap(newCartMap);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch cart ────────────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    try {
      const response = await cartService.getCart();
      updateCartStateFromBackend(response.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  }, [updateCartStateFromBackend]);

  // ── setCart — unified setter passed to all child components ──────────────
  /**
   * Children can call setCart in two ways:
   *
   *  1. With a backend response.data object (the new primary way):
   *       setCart(response.data)
   *     → reads cart_items and updates state directly.
   *
   *  2. With {} to clear (e.g. after checkout):
   *       setCart({})
   *     → clears both cartItems and the map.
   */
  const setCart = useCallback((valueOrData) => {
    // If it looks like a backend response (has cart_items array), apply it
    if (valueOrData && Array.isArray(valueOrData.cart_items)) {
      updateCartStateFromBackend(valueOrData);
      return;
    }
    // Empty object → clear
    if (
      valueOrData &&
      typeof valueOrData === "object" &&
      !Array.isArray(valueOrData) &&
      Object.keys(valueOrData).length === 0
    ) {
      setCartItems([]);
      setCartMap({});
      return;
    }
    // Legacy function form (should not be needed after full migration but
    // kept so nothing breaks during transition)
    if (typeof valueOrData === "function") {
      setCartMap((prevMap) => {
        const nextMap = valueOrData(prevMap);
        // Best-effort sync: re-fetch to get accurate backend state
        fetchCart();
        return nextMap;
      });
    }
  }, [updateCartStateFromBackend, fetchCart]);

  // ── CartModal helpers (used by Navbar) ────────────────────────────────────
  /**
   * Increment a variant's quantity by 1 (called from CartModal / Navbar).
   * Passes the full item object; we extract variant_id.
   */
  const handleCartModalAdd = useCallback(async (item) => {
    const newQty = item.quantity + 1;
    if (newQty > item.stock) return;
    try {
      const response = await cartService.updateQuantity(item.variant_id, newQty);
      updateCartStateFromBackend(response.data);
    } catch (err) {
      console.error("CartModal add failed:", err);
    }
  }, [updateCartStateFromBackend]);

  /**
   * Decrement a variant's quantity by 1, removing it if it reaches 0.
   */
  const handleCartModalRemove = useCallback(async (item) => {
    try {
      let response;
      if (item.quantity <= 1) {
        response = await cartService.removeFromCart(item.variant_id);
      } else {
        response = await cartService.updateQuantity(item.variant_id, item.quantity - 1);
      }
      updateCartStateFromBackend(response.data);
    } catch (err) {
      console.error("CartModal remove failed:", err);
    }
  }, [updateCartStateFromBackend]);

  // ── Effects ───────────────────────────────────────────────────────────────
  // Refetch cart whenever authentication changes
  useEffect(() => {
    fetchCart();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // After login: merge any pending guest cart into the user cart
  useEffect(() => {
    const mergeOnLogin = async () => {
      if (!user) return;
      const guestId = localStorage.getItem("guest_id");
      if (!guestId) return;
      try {
        const response = await cartService.mergeCart(guestId);
        updateCartStateFromBackend(response.data);
        localStorage.removeItem("guest_id");
      } catch {
        // Merge failures are non-fatal
      }
    };
    mergeOnLogin();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("shopease_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("shopease_user");
      }
    } catch (e) {
      console.warn("localStorage unavailable:", e);
    }
  }, [user]);

  // Persist wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("shopease_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("localStorage unavailable:", e);
    }
  }, [wishlist]);

  // Fetch wishlist from backend when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await api.get("/wishlist/");
          const productIds = response.data.map((item) => item.product.id);
          setWishlist(productIds);
        } catch (e) {
          console.error("Failed to load wishlist:", e);
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user]);

  // ── Wishlist toggle ───────────────────────────────────────────────────────
  const toggleWishlist = async (productId) => {
    if (!user) return;
    const exists = wishlist.includes(productId);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      try {
        await api.delete(`/wishlist/${productId}/`);
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
        setWishlist((prev) => [...prev, productId]);
      }
    } else {
      setWishlist((prev) => [...prev, productId]);
      try {
        await api.post("/wishlist/", { product: productId });
      } catch (err) {
        console.error("Failed to add to wishlist:", err);
        setWishlist((prev) => prev.filter((id) => id !== productId));
      }
    }
  };

  // ── Shared props ──────────────────────────────────────────────────────────
  const sharedProps = {
    cart,
    cartItems,
    setCart,
    wishlist,
    setWishlist: toggleWishlist,
    user,
    setUser,
    // CartModal helpers (consumed by Navbar)
    onCartModalAdd: handleCartModalAdd,
    onCartModalRemove: handleCartModalRemove,
  };

// ScrollToTop component to scroll the window to the top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home {...sharedProps} />} />
        <Route path="/cart" element={<Cart {...sharedProps} />} />
        <Route
          path="/product/:id"
          element={<ProductDetails {...sharedProps} />}
        />
        <Route path="/categories" element={<CategoryPage {...sharedProps} />} />
        <Route
          path="/category/:categoryName"
          element={<CategoryProducts {...sharedProps} />}
        />
        <Route path="/products" element={<Products {...sharedProps} />} />
        <Route path="/login" element={<Login user={user} setUser={setUser} />} />
        <Route
          path="/register"
          element={<Register user={user} setUser={setUser} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:uid/:token"
          element={<ResetPassword />}
        />
        <Route path="/wishlist" element={<Wishlist {...sharedProps} />} />
        <Route path="/profile" element={<Profile {...sharedProps} />} />
        <Route path="/orders" element={<MyOrders {...sharedProps} />} />
        <Route path="/address-book" element={<AddressBook {...sharedProps} />} />
        <Route path="/terms" element={<TermsAndConditions {...sharedProps} />} />
        <Route path="/faq" element={<FAQ {...sharedProps} />} />
        <Route path="/privacy" element={<PrivacyPolicy {...sharedProps} />} />
        <Route path="/returns" element={<ReturnsRefunds {...sharedProps} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;