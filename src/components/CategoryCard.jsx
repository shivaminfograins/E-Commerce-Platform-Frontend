// Backend media origin — Vite proxy only handles /api/*, so /media/* paths
// must be served directly from Django. In production, set VITE_MEDIA_BASE_URL.
const BACKEND_ORIGIN =
  import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

function normalizeMediaUrl(url) {
  if (!url) return null;
  if (typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return BACKEND_ORIGIN + url;
  return url;
}

function CategoryCard({ category, isActive = false, onClick }) {
  // API returns: { images: [{ image: "/media/categories/foo.png" }], ... }
  // There is no top-level "image" field — images is always an array.
  const rawImages = category?.images;
  const rawImage = category?.image; // may exist if already normalized upstream

  const imageSrc =
    normalizeMediaUrl(
      typeof rawImage === "string"
        ? rawImage
        : rawImages?.[0]?.image ||
            rawImages?.[0]?.url ||
            rawImage?.image ||
            rawImage?.url ||
            null,
    ) || "/images/categories/default.png";

  return (
    <button
      type="button"
      className={`category-card ${isActive ? "category-card--active" : ""}`}
      onClick={onClick}
    >
      <div className="category-image">
        <img
          src={imageSrc}
          alt={category.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/categories/default.png";
          }}
        />
      </div>

      <div className="category-content">
        <h3>{category.name}</h3>
        <span>View Collection →</span>
      </div>
    </button>
  );
}

export default CategoryCard;
