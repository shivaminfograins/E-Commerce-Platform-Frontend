import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import CartModal from "../components/CartModal";
import { LegalSidebar } from "../components/LegalSidebar";

function PrivacyPolicy({
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
          <h1>Privacy Policy</h1>
          <p className="legal-subtitle">Understand how we collect, store, and safeguard your data</p>
        </div>

        <div className="legal-portal-layout">
          <LegalSidebar />

          <div className="legal-portal-content">
            <div className="legal-highlights-grid">
              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3>Data Protection</h3>
                <p>We use robust standard encryption to secure all transmissions and local cookie details.</p>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3>Opt-Out Control</h3>
                <p>You keep complete authority over your email alerts and optional marketing campaigns.</p>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </div>
                <h3>Zero Selling</h3>
                <p>We do not lease, rent, or trade your personal statistics to third-party marketing firms.</p>
              </div>
            </div>

            <div className="legal-content">
              <section className="legal-section">
                <h2>1. Information We Collect</h2>
                <p>
                  We collect personal information that you provide directly to us when creating an account,
                  placing an order, signing up for newsletters, or contacting customer service. This may include
                  your name, email address, shipping address, billing address, phone number, and payment credentials.
                </p>
              </section>

              <section className="legal-section">
                <h2>2. How We Use Your Information</h2>
                <p>
                  We use your information to process and ship orders, handle payments, send tracking updates,
                  personalize your shopping experience, prevent fraud, and send marketing communications if you
                  have opted in.
                </p>
              </section>

              <section className="legal-section">
                <h2>3. Information Sharing and Disclosure</h2>
                <p>
                  We do not sell or rent your personal information to third parties. We share your data with
                  trusted service providers (e.g. shipping carriers, payment processors, and analytics providers)
                  solely to fulfill business transactions and maintain platform security.
                </p>
              </section>

              <section className="legal-section">
                <h2>4. Data Security</h2>
                <p>
                  We implement industry-standard administrative, physical, and electronic security measures to
                  protect your data from unauthorized access or alteration. However, no transmission over the
                  internet is 100% secure.
                </p>
              </section>

              <section className="legal-section">
                <h2>5. Cookies and Tracking Technologies</h2>
                <p>
                  ShopEase uses cookies and local storage to keep track of your shopping cart sessions, guest IDs,
                  and authenticated user tokens. You can disable cookies in your browser settings, but some features
                  of the website may not function correctly.
                </p>
              </section>

              <section className="legal-section">
                <h2>6. Your Rights</h2>
                <p>
                  Depending on your location, you may have the right to access, correct, delete, or limit the use
                  of your personal data. To exercise these rights, please contact our support team at
                  support@shopease.com.
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

export default PrivacyPolicy;
