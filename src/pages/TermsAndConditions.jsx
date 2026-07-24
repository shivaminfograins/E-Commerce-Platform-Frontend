import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import CartModal from "../components/CartModal";
import { LegalSidebar } from "../components/LegalSidebar";

function TermsAndConditions({
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
          <h1>Terms & Conditions</h1>
          <p className="legal-subtitle">Agreement and governance guidelines for using ShopEase</p>
        </div>

        <div className="legal-portal-layout">
          <LegalSidebar />

          <div className="legal-portal-content">
            <div className="legal-highlights-grid">
              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3>Secure Accounts</h3>
                <p>We enforce strict password standards to keep your billing and personal details guarded.</p>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <h3>Pricing Accuracy</h3>
                <p>In the event of a pricing error, we reserve the right to cancel orders and issue full refunds.</p>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <h3>Fair Delivery</h3>
                <p>Standard delivery times are estimates, but we stand by our transit protection and support.</p>
              </div>
            </div>

            <div className="legal-content">
              <section className="legal-section">
                <h2>1. Introduction</h2>
                <p>
                  Welcome to ShopEase. These Terms & Conditions govern your use of our website and services.
                  By accessing or using our platform, you agree to be bound by these terms. If you do not
                  agree with any part of these terms, please do not use our services.
                </p>
              </section>

              <section className="legal-section">
                <h2>2. Accounts and Registration</h2>
                <p>
                  To place orders or access certain features of the platform, you may need to register for
                  an account. You agree to provide accurate, complete, and updated information during the
                  registration process. You are responsible for safeguarding your account password and
                  restricting unauthorized access to your device.
                </p>
              </section>

              <section className="legal-section">
                <h2>3. Product Information and Pricing</h2>
                <p>
                  We strive to display our products, variant options, and pricing as accurately as possible.
                  However, errors in descriptions, availability, or pricing may occur. In the event of a
                  pricing error, we reserve the right to cancel any orders placed for the affected product,
                  even if the order has been confirmed and payment has been processed.
                </p>
              </section>

              <section className="legal-section">
                <h2>4. Payments and Billing</h2>
                <p>
                  All payments made on ShopEase are processed through secure gateways. By submitting your
                  billing information, you authorize us to charge the designated payment method for the full amount
                  of your order, including applicable taxes, shipping fees, and handling charges.
                </p>
              </section>

              <section className="legal-section">
                <h2>5. Shipping, Delivery, and Risk of Loss</h2>
                <p>
                  Delivery timeframes are estimates and not guaranteed delivery dates. Shipping fees are
                  calculated at checkout based on destination and package size. The risk of loss and title for all
                  items ordered pass to you upon our delivery to the shipping carrier.
                </p>
              </section>

              <section className="legal-section">
                <h2>6. Returns, Refunds, and Exchange Policy</h2>
                <p>
                  We offer a 30-day money-back guarantee on most products. To qualify for a return, the item
                  must be unused, in its original packaging, and in resalable condition. Return shipping costs
                  are the responsibility of the customer unless the product received was defective or incorrect.
                </p>
              </section>

              <section className="legal-section">
                <h2>7. Limitation of Liability</h2>
                <p>
                  In no event shall ShopEase, its directors, or its affiliates be liable for any indirect,
                  incidental, special, consequential, or punitive damages arising out of your access to or use
                  of our services, products purchased, or website platform.
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

export default TermsAndConditions;
