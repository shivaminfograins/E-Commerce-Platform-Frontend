import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import CategoryProducts from "./pages/CategoryProducts";
import Products from "./pages/Products";

function App() {
    const [cart, setCart] = useState(() => {
      try {
        const saved = localStorage.getItem("shopease_cart");
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("shopease_cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route
          path="/product/:id"
          element={<ProductDetails cart={cart} setCart={setCart} />}
        />
        <Route
          path="/categories"
          element={<CategoryPage cart={cart} setCart={setCart} />}
        />
        {/* NEW ROUTE */}
        <Route
          path="/category/:categoryName"
          element={<CategoryProducts cart={cart} setCart={setCart} />}
        />

        <Route
          path="/products"
          element={<Products cart={cart} setCart={setCart} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;