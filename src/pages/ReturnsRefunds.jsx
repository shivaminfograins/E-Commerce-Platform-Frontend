import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import CartModal from "../components/CartModal";
import { LegalSidebar } from "../components/LegalSidebar";

function ReturnsRefunds({
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
  const [search, setSearch] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        search={search}
        setSearch={(val) => {
          setSearch(val);
          navigate("/", { state: { initialSearch: val } });
        }}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => navigate("/wishlist")}
        user={user}
        setUser={setUser}
      />

      <Breadcrumbs />

      <main className="container legal-page-container">
        <div className="legal-header">
          <h1>Returns & Refunds</h1>
          <p className="legal-subtitle">Understand our return procedures and refund guidelines</p>
        </div>

        <div className="legal-portal-layout">
          <LegalSidebar />

          <div className="legal-portal-content">
            <div className="legal-highlights-grid">
              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3>30-Day Policy</h3>
                <p>Enjoy a risk-free trial. Return any eligible product within 30 days of shipment receipt.</p>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="21 15 16 10 5 10"></polyline>
                    <polyline points="8 13 5 10 8 7"></polyline>
                  </svg>
                </div>
                <h3>Free Label Returns</h3>
                <p>We pay for the return shipment tags in cases of damaged, defective, or incorrect items.</p>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                </div>
                <h3>Fast Bank Refund</h3>
                <p>Once inspected, your refund hits the original card within 5-7 business processing days.</p>
              </div>
            </div>

            <div className="legal-content">
              <section className="legal-section">
                <h2>1. Policy Overview</h2>
                <p>
                  We want you to be completely satisfied with your purchase. If you are not happy with your order,
                  you may return eligible items within 30 days of the delivery date for a full refund or exchange,
                  subject to the conditions outlined below.
                </p>
              </section>

              <section className="legal-section">
                <h2>2. Eligibility Criteria</h2>
                <p>
                  To qualify for a return or refund:
                </p>
                <ul style={{ paddingLeft: "20px", color: "#475569", lineHeight: "1.6", marginTop: "10px" }}>
                  <li>Items must be unused, unwashed, and in the same condition as received.</li>
                  <li>Products must remain in their original packaging with all tags and seals intact.</li>
                  <li>Proof of purchase (invoice or order confirmation email) must be provided.</li>
                  <li>Certain goods, such as personalized items or final sale products, are not eligible for return.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2>3. Return Procedure</h2>
                <p>
                  To initiate a return:
                </p>
                <ol style={{ paddingLeft: "20px", color: "#475569", lineHeight: "1.6", marginTop: "10px" }}>
                  <li>Go to 'My Orders' in your profile or contact us at returns@shopease.com with your order number.</li>
                  <li>Package the items securely to prevent damage during transit.</li>
                  <li>Attach the return shipping label provided by customer service.</li>
                  <li>Drop off the package at any authorized shipping carrier location.</li>
                </ol>
              </section>

              <section className="legal-section">
                <h2>4. Refund Timelines</h2>
                <p>
                  Once your return package is received and inspected by our quality assurance team (typically within
                  3-5 business days of arrival), we will process your refund. The funds will be returned to the
                  original payment method used during checkout. Please note that it may take an additional 3-5
                  business days for your bank or credit card company to post the transaction.
                </p>
              </section>

              <section className="legal-section">
                <h2>5. Return Shipping Fees</h2>
                <p>
                  If you receive a damaged, defective, or incorrect product, ShopEase will cover all return
                  shipping fees. For standard returns based on personal preference, change of mind, or incorrect
                  size selection, a return shipping fee of $5.99 will be deducted from your final refund amount.
                </p>
              </section>

              <section className="legal-section">
                <h2>6. Exchanges</h2>
                <p>
                  We only replace items if they are defective, damaged, or require a different size. If you need
                  to exchange an item, please reach out to us at support@shopease.com to arrange a replacement.
                </p>
              </section>
            </div>
          </div>
        </div>

        <CartModal
          isOpen={isCartOpen}
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          onAdd={onCartModalAdd}
          onRemove={onCartModalRemove}
        />
      </main>

      <Footer />
    </>
  );
}

export default ReturnsRefunds;
