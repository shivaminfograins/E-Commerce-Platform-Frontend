import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductList from "../components/ProductList";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import CartModal from "../components/CartModal";
import { productService } from "../services/productService";
import PromotionBanner from "../components/PromotionBanner";
import BrandShowcase from "../components/BrandShowcase";
import Testimonials from "../components/Testimonials";
import FloatingWidgets from "../components/FloatingWidgets";

// import services
import categoryService from "../services/categoryService";

function FlashSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;

      if (diff <= 0) {
        return "00:00:00";
      }

      const hrs = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
      const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      return `${hrs}:${mins}:${secs}`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flash-sale-countdown">
      <span className="live-badge">⚡ FLASH DEAL</span>
      <span className="ends-in">Ends in:</span>
      <span className="timer-digits">{timeLeft}</span>
    </div>
  );
}

function Home({
  cart = {},
  cartItems = [],
  setCart,
  wishlist = [],
  setWishlist,
  user,
  setUser,
  onCartModalAdd,
  onCartModalRemove,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  // Sync search state from navigation redirect (e.g. from Terms or FAQ page)
  useEffect(() => {
    if (location.state?.initialSearch !== undefined) {
      setSearch(location.state.initialSearch);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    name: "All",
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [categories, setCategories] = useState([{ id: 0, name: "All" }]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Search Results Filters & Sorting State
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [filterRating, setFilterRating] = useState(0);
  const [filterDiscount, setFilterDiscount] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fetch products matching category and debounced search
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setProductError("");
      try {
        const params = {};
        if (selectedCategory.id !== 0) {
          params.category = selectedCategory.id;
        }
        if (debouncedSearch.trim() !== "") {
          params.search = debouncedSearch.trim();
        }

        const data = await productService.getProducts(params);
        const items =
          Array.isArray(data) && data.length
            ? data
            : data.results || data.products || [];

        const normalizedProducts = items.map((product) => {
          const rawImage =
            product.images?.[0]?.image || product.images?.[0]?.url || "";
          const normalizeUrl = (url) => {
            if (!url || typeof url !== "string") return "";
            if (url.startsWith("http://") || url.startsWith("https://")) return url;
            return url;
          };
          const imageUrl = normalizeUrl(rawImage);
          const firstVariant = product.variants?.[0] || {};
          const price = firstVariant.price ? Number(firstVariant.price) : 0;

          // Generate realistic discount structure for production UI look
          const discountPercent = product.id % 3 === 0 ? 15 : product.id % 4 === 0 ? 25 : 0;
          const originalPrice = discountPercent > 0 ? Math.round(price / (1 - discountPercent / 100)) : price;

          return {
            id: product.id,
            name: product.name,
            brand: product.brand || "ShopEase Brand",
            image: imageUrl,
            price,
            originalPrice,
            discountPercent,
            rating: product.rating || (4.0 + (product.id % 10) * 0.1),
            reviewsCount: product.reviewsCount || (12 + product.id * 7),
            badge: product.id % 5 === 0 ? "Best Seller" : product.id % 3 === 0 ? "Hot" : "",
            category: product.category,
            description: product.description,
          };
        });

        setProducts(normalizedProducts);
      } catch (err) {
        setProductError("Failed to load products.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCategory.id, debouncedSearch]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // fetch categories from the API when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const [catData, imgData] = await Promise.all([
        categoryService.getCategories(),
        categoryService.getCategoryImages().catch(() => [])
      ]);

      const BACKEND_ORIGIN = import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";
      const normalizeMediaUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        if (url.startsWith("/media/")) return BACKEND_ORIGIN + url;
        return url;
      };

      const imageMap = {};
      if (Array.isArray(imgData)) {
        imgData.forEach(img => {
          if (img.category) {
            imageMap[img.category] = normalizeMediaUrl(img.image);
          }
        });
      }

      const fallbackImages = {
        "all": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&fit=crop&q=80",
        "electronics": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&fit=crop&q=60",
        "books": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&fit=crop&q=60",
        "home": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=150&fit=crop&q=60",
        "sports": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150&fit=crop&q=60",
        "arts": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=150&fit=crop&q=60",
        "gifts": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&fit=crop&q=60",
        "cat 1": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&fit=crop&q=60",
      };

      let myCategories = catData.map((category) => {
        const catNameLower = category.name.toLowerCase();
        const apiImagePath = category.images?.[0]?.image || category.images?.[0]?.url || "";
        let image = normalizeMediaUrl(apiImagePath) || imageMap[category.id] || "";
        if (!image) {
          const key = Object.keys(fallbackImages).find(k => catNameLower.includes(k));
          image = key ? fallbackImages[key] : "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=150&fit=crop&q=60";
        }
        return {
          id: category.id,
          name: category.name,
          image: image
        };
      });

      setCategories([
        { 
          id: 0, 
          name: "All", 
          image: fallbackImages["all"] 
        }, 
        ...myCategories
      ]);
    } catch (error) {
      console.error(error);
      setCategoryError("Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

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

  const isSearching = debouncedSearch.trim() !== "";

  const productsWithMeta = products.map((product) => ({
    ...product,
    qty: cart[product.id] || 0,
    isWishlisted: wishlist.includes(product.id),
  }));

  // Filtering & Sorting Logic for search results
  const uniqueBrands = Array.from(new Set(productsWithMeta.map(p => p.brand).filter(Boolean)));

  const filteredSearchResults = productsWithMeta.filter((product) => {
    // Brand Filter
    if (filterBrand !== "All" && product.brand !== filterBrand) return false;

    // Price Filter
    if (filterPrice === "under10k" && product.price >= 10000) return false;
    if (filterPrice === "10kto50k" && (product.price < 10000 || product.price > 50000)) return false;
    if (filterPrice === "above50k" && product.price <= 50000) return false;

    // Rating Filter
    if (filterRating > 0 && product.rating < filterRating) return false;

    // Discount Filter
    if (filterDiscount > 0 && product.discountPercent < filterDiscount) return false;

    return true;
  });

  // Sorting
  if (sortBy === "lowToHigh") {
    filteredSearchResults.sort((a, b) => a.price - b.price);
  } else if (sortBy === "highToLow") {
    filteredSearchResults.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredSearchResults.sort((a, b) => b.rating - a.rating);
  } else {
    // newest arrivals
    filteredSearchResults.sort((a, b) => b.id - a.id);
  }

  // Diverse Sections (Non-searching mode)
  const flashSaleProducts = productsWithMeta.filter(p => p.discountPercent > 0).slice(0, 4);
  const bestSellerProducts = [...productsWithMeta].sort((a, b) => b.rating - a.rating).slice(0, 10);
  const recommendedProducts = [...productsWithMeta].reverse().slice(0, 10);

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        search={search}
        setSearch={setSearch}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => navigate("/wishlist")}
        user={user}
        setUser={setUser}
      />

      <main className="container">
        {!isSearching && <Hero />}

        {!isSearching && (
          <Categories
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

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
            {isSearching ? (
              // Search Results Layout with Filter/Sort Side Panel
              <div className="search-results-layout">
                <aside className="search-filters-sidebar">
                  <div className="sidebar-header">
                    <h3>Filters</h3>
                    <button
                      className="clear-filters-btn"
                      onClick={() => {
                        setFilterBrand("All");
                        setFilterPrice("All");
                        setFilterRating(0);
                        setFilterDiscount(0);
                      }}
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="filter-group">
                    <h4>Brand</h4>
                    <select
                      value={filterBrand}
                      onChange={(e) => setFilterBrand(e.target.value)}
                      className="filter-select"
                    >
                      <option value="All">All Brands</option>
                      {uniqueBrands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <h4>Price Range</h4>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filterPrice === "All"}
                        onChange={() => setFilterPrice("All")}
                      />
                      <span>All Prices</span>
                    </label>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filterPrice === "under10k"}
                        onChange={() => setFilterPrice("under10k")}
                      />
                      <span>Under ₹10,000</span>
                    </label>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filterPrice === "10kto50k"}
                        onChange={() => setFilterPrice("10kto50k")}
                      />
                      <span>₹10,000 - ₹50,000</span>
                    </label>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filterPrice === "above50k"}
                        onChange={() => setFilterPrice("above50k")}
                      />
                      <span>Above ₹50,000</span>
                    </label>
                  </div>

                  <div className="filter-group">
                    <h4>Customer Rating</h4>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="rating"
                        checked={filterRating === 0}
                        onChange={() => setFilterRating(0)}
                      />
                      <span>All Ratings</span>
                    </label>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="rating"
                        checked={filterRating === 4}
                        onChange={() => setFilterRating(4)}
                      />
                      <span>4★ & above</span>
                    </label>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="rating"
                        checked={filterRating === 3}
                        onChange={() => setFilterRating(3)}
                      />
                      <span>3★ & above</span>
                    </label>
                  </div>

                  <div className="filter-group">
                    <h4>Discount Percentage</h4>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="discount"
                        checked={filterDiscount === 0}
                        onChange={() => setFilterDiscount(0)}
                      />
                      <span>Any Discount</span>
                    </label>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="discount"
                        checked={filterDiscount === 10}
                        onChange={() => setFilterDiscount(10)}
                      />
                      <span>10% Off & more</span>
                    </label>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="discount"
                        checked={filterDiscount === 20}
                        onChange={() => setFilterDiscount(20)}
                      />
                      <span>20% Off & more</span>
                    </label>
                  </div>
                </aside>

                <div className="search-results-content">
                  <div className="results-toolbar">
                    <span className="results-count-text">
                      Showing <strong>{filteredSearchResults.length}</strong> products for "{debouncedSearch}"
                    </span>
                    <div className="sort-control-wrapper">
                      <span className="sort-label">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                      >
                        <option value="newest">Newest Arrivals</option>
                        <option value="lowToHigh">Price: Low to High</option>
                        <option value="highToLow">Price: High to Low</option>
                        <option value="rating">Customer Ratings</option>
                      </select>
                    </div>
                  </div>

                  {filteredSearchResults.length === 0 ? (
                    <p className="section-message">No products match your filters.</p>
                  ) : (
                    <ProductList
                      products={filteredSearchResults}
                      onAdd={handleAddToCart}
                      onRemove={handleRemoveFromCart}
                      onToggleWishlist={handleToggleWishlist}
                      showViewAll={false}
                      title=""
                    />
                  )}
                </div>
              </div>
            ) : (
              // Diverse Product Sections
              <div className="homepage-sections">
                {/* 1. Deals of the Day / Flash Sale */}
                {flashSaleProducts.length > 0 && (
                  <section className="homepage-section-block flash-sales-section">
                    <div className="section-header-row">
                      <div className="header-title-side">
                        <h2>Deals of the Day</h2>
                        <FlashSaleCountdown />
                      </div>
                    </div>
                    <ProductList
                      products={flashSaleProducts}
                      onAdd={handleAddToCart}
                      onRemove={handleRemoveFromCart}
                      onToggleWishlist={handleToggleWishlist}
                      showViewAll={true}
                      title=""
                    />
                  </section>
                )}

                {/* 2. Best Sellers */}
                {bestSellerProducts.length > 0 && (
                  <section className="homepage-section-block best-sellers-section">
                    <div className="section-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h2>Trending & Best Sellers</h2>
                      <button 
                        onClick={() => navigate("/products")} 
                        className="view-all-link"
                        style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
                      >
                        View All →
                      </button>
                    </div>
                    <div className="trending-best-sellers-grid">
                      {bestSellerProducts.map((product) => (
                        <div 
                          key={product.id} 
                          className="trending-card" 
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <div className="trending-card__img-wrapper">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="trending-card__img" 
                            />
                          </div>
                          <div className="trending-card__content">
                            <h3 className="trending-card__name">{product.name}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. Recommended for You */}
                {recommendedProducts.length > 0 && (
                  <section className="homepage-section-block recommended-section">
                    <div className="section-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h2>Recommended for You</h2>
                      <button 
                        onClick={() => navigate("/products")} 
                        className="view-all-link"
                        style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
                      >
                        View All →
                      </button>
                    </div>
                    <div className="trending-best-sellers-grid">
                      {recommendedProducts.map((product) => (
                        <div 
                          key={product.id} 
                          className="trending-card" 
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <div className="trending-card__img-wrapper">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="trending-card__img" 
                            />
                          </div>
                          <div className="trending-card__content">
                            <h3 className="trending-card__name">{product.name}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}

        {!isSearching && <PromotionBanner />}

        {/* Brand Showcase */}
        {!isSearching && <BrandShowcase />}

        {/* Testimonials */}
        {!isSearching && <Testimonials />}

        {!isSearching && <Newsletter />}

        <CartModal
          isOpen={isCartOpen}
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          onAdd={onCartModalAdd}
          onRemove={onCartModalRemove}
        />
      </main>

      {/* Floating Utilities */}
      <FloatingWidgets />

      <Footer />
    </>
  );
}

export default Home;
