import { useState } from "react";

function ProductDescription({ product }) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "specs", label: "Specifications" },
    { id: "shipping", label: "Shipping & Returns" }
  ];

  return (
    <section className="product-tabs-section">
      {/* Tabs Header bar */}
      <div className="tabs-header-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-toggle-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Viewport Panel */}
      <div className="tabs-viewport-panel">
        {activeTab === "overview" && (
          <div className="tab-pane-content fade-in">
            <p className="description-text-premium">
              {product.name} represents the pinnacle of modern technology and elegant design. Built from premium quality materials, it provides outstanding performance, excellent durability, and a highly satisfying user experience. Whether for daily utility or advanced tasks, it is engineered to exceed your expectations.
            </p>
            
            <div className="overview-features-list">
              <div className="feature-item-pill">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Premium Quality Material & Build</span>
              </div>
              <div className="feature-item-pill">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Ergonomically Designed for Daily Comfort</span>
              </div>
              <div className="feature-item-pill">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>High-Performance Reliability</span>
              </div>
              <div className="feature-item-pill">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Official Manufacturer Warranty Included</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="tab-pane-content fade-in">
            <div className="specs-table-wrapper">
              <table className="specs-table">
                <tbody>
                  <tr>
                    <th>Brand</th>
                    <td>{product.brand}</td>
                  </tr>
                  <tr>
                    <th>Model</th>
                    <td>{product.name}</td>
                  </tr>
                  <tr>
                    <th>Category</th>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <th>Product Rating</th>
                    <td>
                      <div className="table-rating-display">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className="text-amber">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>{product.rating} / 5.0 ({product.reviewsCount} reviews)</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Availability</th>
                    <td><span className="badge-text-success">In Stock</span></td>
                  </tr>
                  <tr>
                    <th>Warranty Period</th>
                    <td>1-Year Manufacturer Warranty</td>
                  </tr>
                  <tr>
                    <th>Country of Origin</th>
                    <td>Imported / Premium Quality</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="tab-pane-content fade-in">
            <ul className="shipping-policy-list">
              <li>
                <strong>🚚 Free Standard Shipping:</strong> Enjoy free standard delivery on all domestic orders (dispatch within 24 hours).
              </li>
              <li>
                <strong>⏱️ Estimated Delivery:</strong> Standard transit takes 3 to 5 business days depending on location. Express 24-48h delivery option is available at checkout.
              </li>
              <li>
                <strong>🔄 Hassle-Free Returns:</strong> Backed by a 30-day money-back guarantee. Return items in original packaging for a full refund or exchange.
              </li>
              <li>
                <strong>📦 Secure Eco-Friendly Packaging:</strong> All orders are carefully packed in shockproof, eco-friendly custom boxes to ensure safety in transit.
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDescription;
