import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import CartModal from "../components/CartModal";
import { LegalSidebar } from "../components/LegalSidebar";

function FAQ({
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
  const [activeAccordion, setActiveAccordion] = useState(null);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const faqData = [
    {
      category: "Orders & Account",
      items: [
        {
          question: "How do I track my order?",
          answer: "Once your order ships, we will send you an email confirmation with a tracking number and a link to track your package on the carrier's website. You can also view details under 'My Orders' in your account.",
        },
        {
          question: "Can I cancel or modify my order?",
          answer: "Orders can be canceled or modified within 30 minutes of placement. Please go to 'My Orders' or contact our support team immediately. Once the order has been processed for shipping, it cannot be modified.",
        },
        {
          question: "How do I create an account?",
          answer: "Click on the 'Login' option in the top navigation bar and select 'Register'. Provide your details to instantly create a secure ShopEase account.",
        },
      ],
    },
    {
      category: "Shipping & Delivery",
      items: [
        {
          question: "What shipping options are available?",
          answer: "We offer Standard Shipping (3-5 business days) and Express Shipping (1-2 business days). Shipping costs and details are calculated at checkout.",
        },
        {
          question: "Do you ship internationally?",
          answer: "Currently, we only ship within the country. We hope to expand to international delivery services in the near future.",
        },
        {
          question: "My package says delivered but I haven't received it.",
          answer: "Please check with neighbors or family members first. Sometimes carriers scan items as delivered prematurely. If it still doesn't arrive within 24 hours, contact our support team.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      items: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unused, unopened products in their original packaging. Return shipping fees apply unless the return is due to our error.",
        },
        {
          question: "How long does a refund take?",
          answer: "Refunds are processed within 5-7 business days of receiving the returned item at our warehouse. It may take an additional 3-5 business days for the funds to reflect in your original payment method.",
        },
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

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
          <h1>Frequently Asked Questions</h1>
          <p className="legal-subtitle">Find answers to common questions about ShopEase services</p>
        </div>

        <div className="legal-portal-layout">
          <LegalSidebar />

          <div className="legal-portal-content">
            <div className="faq-container">
              {faqData.map((group, groupIdx) => (
                <div key={groupIdx} className="faq-group">
                  <h2 className="faq-group-title">{group.category}</h2>
                  <div className="faq-list">
                    {group.items.map((item, itemIdx) => {
                      const globalIdx = `${groupIdx}-${itemIdx}`;
                      const isOpen = activeAccordion === globalIdx;
                      return (
                        <div
                          key={itemIdx}
                          className={`faq-item ${isOpen ? "open" : ""}`}
                        >
                          <button
                            className="faq-question-btn"
                            onClick={() => toggleAccordion(globalIdx)}
                            aria-expanded={isOpen}
                          >
                            <span>{item.question}</span>
                            <svg
                              className="faq-arrow-icon"
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>
                          <div className="faq-answer-container">
                            <div className="faq-answer-content">
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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

export default FAQ;
