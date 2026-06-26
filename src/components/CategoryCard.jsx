function CategoryCard({ category, isActive = false, onClick }) {
  const rawImage = category?.image || category?.images;
  const normalizeUrl = (url) => {
    if (!url) return "/images/categories/default.png";
    if (typeof url !== "string") return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      const backendOrigin = apiBase.replace(/\/api\/?$/, "");
      return backendOrigin + url;
    }
    return url;
  };

  const imageSrc = normalizeUrl(
    typeof rawImage === "string"
      ? rawImage
      : rawImage?.url ||
          rawImage?.image ||
          rawImage?.[0]?.url ||
          rawImage?.[0]?.image ||
          "/images/categories/default.png",
  );

  return (
    <button
      type="button"
      className={`category-card ${isActive ? "category-card--active" : ""}`}
      onClick={onClick}
    >
      <div className="category-image">
        <img src={imageSrc} alt={category.name} />
      </div>

      <div className="category-content">
        <h3>{category.name}</h3>
        <span>View Collection →</span>
      </div>
    </button>
  );
}

export default CategoryCard;
