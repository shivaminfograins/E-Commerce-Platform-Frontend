import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductFilters from "../components/ProductFilters";
import ProductSort from "../components/ProductSort";
import ProductList from "../components/ProductList";

import products from "../data/products";

function Products({ cart = {}, setCart }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [priceRange, setPriceRange] = useState("All");
  const [wishlist, setWishlist] = useState(new Set());

  let filteredProducts = [...products];

  // Search
  filteredProducts = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Category
  if (selectedCategory !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory,
    );
  }

  // Price
  if (priceRange === "under10k") {
    filteredProducts = filteredProducts.filter(
      (product) => product.price < 10000,
    );
  }

  if (priceRange === "10kto50k") {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= 10000 && product.price <= 50000,
    );
  }

  if (priceRange === "above50k") {
    filteredProducts = filteredProducts.filter(
      (product) => product.price > 50000,
    );
  }

  // Sorting
  if (sortBy === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  const handleAddToCart = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const updated = new Set(prev);
      if (updated.has(productId)) {
        updated.delete(productId);
      } else {
        updated.add(productId);
      }
      return updated;
    });
  };

  const productsWithMeta = filteredProducts.map((product) => ({
    ...product,
    qty: cart[product.id] || 0,
    isWishlisted: wishlist.has(product.id),
  }));

  return (
    <>
      <Navbar
        cartCount={cartCount}
        search={search}
        setSearch={setSearch}
        onCartClick={() => navigate("/cart")}
      />

      <div className="container">
        <h1 className="page-title">All Products</h1>

        <div className="products-page">
          <ProductFilters
            search={search}
            setSearch={setSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          <div className="products-content">
            <ProductSort sortBy={sortBy} setSortBy={setSortBy} />

            <ProductList
              products={productsWithMeta}
              onAdd={handleAddToCart}
              onRemove={handleRemoveFromCart}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Products;
