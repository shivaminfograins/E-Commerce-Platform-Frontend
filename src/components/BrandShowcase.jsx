import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const BACKEND_ORIGIN = import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

const normalizeUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return BACKEND_ORIGIN + url;
  return BACKEND_ORIGIN + "/" + url;
};

const isImageUrl = (logo) => {
  if (!logo) return false;
  return logo.startsWith("/") || logo.startsWith("http://") || logo.startsWith("https://");
};

function BrandShowcase() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/products/brands/");
        const activeBrands = (response.data || []).filter(
          (b) => b.status === "Active" || !b.status
        );
        setBrands(activeBrands);
      } catch (err) {
        console.error("Failed to load showcase brands:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section className="brand-showcase-section" style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: "#64748b" }}>Loading brands...</p>
      </section>
    );
  }

  if (brands.length === 0) return null;

  // Duplicate the list of brands to allow infinite marquee scrolling
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section className="brand-showcase-section">
      <div className="section-header">
        <div>
          <h2>Shop by Brand</h2>
          <p className="section-subtitle">Top premium brands, authorized retail store</p>
        </div>
      </div>
      
      <div className="brand-marquee-container">
        <div className="brand-marquee-track">
          {marqueeBrands.map((brand, index) => (
            <div 
              key={`${brand.id}-${index}`} 
              className="brand-card"
              onClick={() => navigate("/products", { state: { selectedBrandId: brand.id } })}
            >
              <div className="brand-logo-wrapper">
                {isImageUrl(brand.image) ? (
                  <img 
                    src={normalizeUrl(brand.image)} 
                    alt={brand.name} 
                    className="brand-logo-img"
                    style={{ width: "80%", height: "80%", objectFit: "contain" }}
                  />
                ) : (
                  <span className="brand-logo-emoji">{brand.image || "🏷️"}</span>
                )}
              </div>
              <h4 className="brand-name">{brand.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandShowcase;
