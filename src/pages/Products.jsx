import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductFilters from "../components/ProductFilters";
import ProductSort from "../components/ProductSort";
import ProductList from "../components/ProductList";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

function Products({
  cart = {},
  setCart,
  wishlist = [],
  setWishlist,
  user,
  setUser,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    name: "All",
  });
  const [sortBy, setSortBy] = useState("latest");
  const [priceRange, setPriceRange] = useState("All");
  const [page, setPage] = useState(1);

  const { categories: apiCategories, loading: loadingCategories } =
    useCategories();
  const categories = [{ id: 0, name: "All" }, ...apiCategories];
  const {
    products,
    totalCount,
    next,
    previous,
    loading: loadingProducts,
    error: productError,
  } = useProducts(selectedCategory.id, page);

  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    let priceMatch = true;

    if (priceRange === "under10k") {
      priceMatch = product.price < 10000;
    } else if (priceRange === "10kto50k") {
      priceMatch = product.price >= 10000 && product.price <= 50000;
    } else if (priceRange === "above50k") {
      priceMatch = product.price > 50000;
    }

    return searchMatch && priceMatch;
  });

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

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
    if (!user) {
      if (window.confirm("You need to be logged in to add products to your wishlist. Would you like to log in now?")) {
        navigate("/login");
      }
      return;
    }
    setWishlist(productId);
  };

  const productsWithMeta = filteredProducts.map((product) => ({
    ...product,
    qty: cart[product.id] || 0,
    isWishlisted: wishlist.includes(product.id),
  }));

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        search={search}
        setSearch={setSearch}
        onCartClick={() => navigate("/cart")}
        onWishlistClick={() => navigate("/wishlist")}
        user={user}
        setUser={setUser}
      />

      <div className="container">
        <h1 className="page-title">All Products</h1>

        <div className="products-page">
          <ProductFilters
            search={search}
            setSearch={setSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          <div className="products-content">
            <ProductSort sortBy={sortBy} setSortBy={setSortBy} />

            {loadingProducts && (
              <p className="section-message">Loading products...</p>
            )}
            {productError && (
              <p className="section-message section-message--error">
                {productError}
              </p>
            )}
            {!loadingProducts && !productError && (
              <>
                <ProductList
                  products={productsWithMeta}
                  onAdd={handleAddToCart}
                  onRemove={handleRemoveFromCart}
                  onToggleWishlist={handleToggleWishlist}
                />

                <div className="pagination-controls">
                  <button
                    type="button"
                    disabled={!previous}
                    onClick={() =>
                      setPage((prevPage) => Math.max(prevPage - 1, 1))
                    }
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {Math.max(1, Math.ceil(totalCount / 10))}
                  </span>
                  <button
                    type="button"
                    disabled={!next}
                    onClick={() => setPage((prevPage) => prevPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Products;
