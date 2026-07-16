import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductFilters from "../components/ProductFilters";
import ProductSort from "../components/ProductSort";
import ProductList from "../components/ProductList";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import brandService from "../admin/services/brandService";

function Products({
  cart = {},
  setCart,
  wishlist = [],
  setWishlist,
  user,
  setUser,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    name: "All",
  });
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState({
    id: 0,
    name: "All",
  });
  const [sortBy, setSortBy] = useState("latest");
  const [priceRange, setPriceRange] = useState("All");
  const [page, setPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState([]);

  const { categories: apiCategories } = useCategories();
  const categories = [{ id: 0, name: "All" }, ...apiCategories];

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await brandService.getBrands();
        setBrands([
          { id: 0, name: "All" },
          ...data.filter((b) => b.status === "Active"),
        ]);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (location.state?.selectedBrandId && brands.length > 0) {
      const match = brands.find((b) => b.id === location.state.selectedBrandId);
      if (match) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedBrand(match);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, brands, navigate, location.pathname]);

  const {
    products,
    totalCount,
    next,
    previous,
    loading: loadingProducts,
    error: productError,
  } = useProducts(selectedCategory.id, selectedBrand.id, page, priceRange);

  // Sync loaded products with the accumulated list
  useEffect(() => {
    if (page === 1) {
      setAccumulatedProducts(products);
    } else {
      setAccumulatedProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = products.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
    }
  }, [products, page]);

  // Reset page to 1 whenever any filters change
  useEffect(() => {
    setPage(1);
    setAccumulatedProducts([]);
  }, [selectedCategory, selectedBrand, priceRange, search]);

  const filteredProducts = accumulatedProducts.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    let priceMatch = true;
    const minPrice = product.minPrice ?? product.price;
    const maxPrice = product.maxPrice ?? product.price;

    if (priceRange === "under10k") {
      priceMatch = minPrice < 10000;
    } else if (priceRange === "10kto50k") {
      priceMatch = maxPrice >= 10000 && minPrice <= 50000;
    } else if (priceRange === "above50k") {
      priceMatch = maxPrice > 50000;
    }

    return searchMatch && priceMatch;
  });

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
      if (
        window.confirm(
          "You need to be logged in to add products to your wishlist. Would you like to log in now?",
        )
      ) {
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
            brands={brands}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />

          <div className="products-content">
            <ProductSort sortBy={sortBy} setSortBy={setSortBy} />

            {loadingProducts && productsWithMeta.length === 0 && (
              <p className="section-message">Loading products...</p>
            )}
            {productError && (
              <p className="section-message section-message--error">
                {productError}
              </p>
            )}
            {!productError && (
              <>
                {productsWithMeta.length === 0 && !loadingProducts && (
                  <p className="section-message">No products found.</p>
                )}

                {productsWithMeta.length > 0 && (
                  <ProductList
                    products={productsWithMeta}
                    onAdd={handleAddToCart}
                    onRemove={handleRemoveFromCart}
                    onToggleWishlist={handleToggleWishlist}
                  />
                )}

                {priceRange === "All" &&
                  productsWithMeta.length < totalCount && (
                    <div className="load-more-container">
                      <button
                        type="button"
                        className="btn-load-more"
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                        disabled={loadingProducts}
                      >
                        {loadingProducts ? (
                          <span className="load-more-spinner-wrapper">
                            <span className="load-more-spinner"></span>
                            Loading...
                          </span>
                        ) : (
                          "Load More Products"
                        )}
                      </button>
                    </div>
                  )}
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
