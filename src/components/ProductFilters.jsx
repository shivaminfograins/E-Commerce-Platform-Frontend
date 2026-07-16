const BACKEND_ORIGIN = import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

const normalizeMediaUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.startsWith("/media/")) return BACKEND_ORIGIN + url;
  return url;
};

function ProductFilters({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  brands = [],
  selectedBrand,
  setSelectedBrand,
}) {
  return (
    <aside className="products-sidebar">
      <div className="sidebar-section">
        <h4 className="sidebar-title">Search</h4>
        <div className="sidebar-search-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sidebar-search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            className="sidebar-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-section">
        <h4 className="sidebar-title">Price Range</h4>
        <div className="price-filters-list">
          <label className="price-filter-item">
            <input
              type="radio"
              className="custom-radio"
              checked={priceRange === "All"}
              onChange={() => setPriceRange("All")}
            />
            <span className="price-label-text">All Prices</span>
          </label>

          <label className="price-filter-item">
            <input
              type="radio"
              className="custom-radio"
              checked={priceRange === "under10k"}
              onChange={() => setPriceRange("under10k")}
            />
            <span className="price-label-text">Under ₹10,000</span>
          </label>

          <label className="price-filter-item">
            <input
              type="radio"
              className="custom-radio"
              checked={priceRange === "10kto50k"}
              onChange={() => setPriceRange("10kto50k")}
            />
            <span className="price-label-text">₹10,000 - ₹50,000</span>
          </label>

          <label className="price-filter-item">
            <input
              type="radio"
              className="custom-radio"
              checked={priceRange === "above50k"}
              onChange={() => setPriceRange("above50k")}
            />
            <span className="price-label-text">Above ₹50,000</span>
          </label>
        </div>
      </div>

      <div className="sidebar-section">
        <h4 className="sidebar-title">Categories</h4>
        <div className="category-filters-list">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-filter-btn ${
                selectedCategory?.id === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <span className="category-btn-text">{category.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="category-chevron"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4 className="sidebar-title">Brands</h4>
        <div className="brand-filters-list">
          {brands.map((brand) => {
            const isActive = selectedBrand?.id === brand.id;
            const logoUrl = normalizeMediaUrl(brand.image);
            return (
              <button
                key={brand.id}
                className={`brand-filter-btn ${isActive ? "active" : ""}`}
                onClick={() => setSelectedBrand(brand)}
              >
                <div className="brand-logo-container">
                  {logoUrl ? (
                    <img src={logoUrl} alt={brand.name} className="brand-logo-img" />
                  ) : (
                    <span className="brand-logo-fallback">🏷️</span>
                  )}
                </div>
                <span className="brand-name-text">{brand.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default ProductFilters;
