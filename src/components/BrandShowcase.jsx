import React from "react";

const BRANDS = [
  { id: 1, name: "Apple", logo: "🍎", category: "Premium Tech" },
  { id: 2, name: "Samsung", logo: "📱", category: "Smartphones & TVs" },
  { id: 3, name: "Dell", logo: "💻", category: "Laptops & Monitors" },
  { id: 4, name: "Sony", logo: "🎧", category: "Audio & Gaming" },
  { id: 5, name: "Adidas", logo: "👟", category: "Sportswear & Shoes" },
  { id: 6, name: "Nike", logo: "✔️", category: "Athletic Gear" }
];

function BrandShowcase() {
  return (
    <section className="brand-showcase-section">
      <div className="section-header">
        <div>
          <h2>Shop by Brand</h2>
          <p className="section-subtitle">Top premium brands, authorized retail store</p>
        </div>
      </div>
      <div className="brand-grid">
        {BRANDS.map((brand) => (
          <div key={brand.id} className="brand-card">
            <div className="brand-logo-wrapper">
              <span className="brand-logo-emoji">{brand.logo}</span>
            </div>
            <h4 className="brand-name">{brand.name}</h4>
            <span className="brand-category">{brand.category}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandShowcase;
