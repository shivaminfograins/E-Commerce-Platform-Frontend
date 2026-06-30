import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import CategoryProducts from "./pages/CategoryProducts";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import AddressBook from "./pages/AddressBook";
import api from "./api/axios";


function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_cart");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

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

  useEffect(() => {
    try {
      localStorage.setItem("shopease_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("localStorage is not available:", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("shopease_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("shopease_user");
      }
    } catch (e) {
      console.warn("localStorage is not available:", e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("shopease_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("localStorage is not available:", e);
    }
  }, [wishlist]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await api.get("/wishlist/");
          const productIds = response.data.map(item => item.product.id);
          setWishlist(productIds);
        } catch (e) {
          console.error("Failed to load wishlist from server:", e);
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) return;
    const exists = wishlist.includes(productId);
    if (exists) {
      setWishlist(prev => prev.filter(id => id !== productId));
      try {
        await api.delete(`/wishlist/${productId}/`);
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
        setWishlist(prev => [...prev, productId]);
      }
    } else {
      setWishlist(prev => [...prev, productId]);
      try {
        await api.post("/wishlist/", { product: productId });
      } catch (err) {
        console.error("Failed to add to wishlist:", err);
        setWishlist(prev => prev.filter(id => id !== productId));
      }
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/categories"
          element={
            <CategoryPage
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />
        {/* NEW ROUTE */}
        <Route
          path="/category/:categoryName"
          element={
            <CategoryProducts
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />

        <Route
          path="/products"
          element={
            <Products
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />

        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route
          path="/register"
          element={<Register user={user} setUser={setUser} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route
          path="/wishlist"
          element={
            <Wishlist
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <MyOrders
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/address-book"
          element={
            <AddressBook
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;