import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    badge: "🔥 Limited Time Offer",
    title: "Discover Premium\nTech Products",
    subtitle: "Explore the latest smartphones, laptops, accessories and fashion products at unbeatable prices.",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1920&q=80",
    primaryLink: "/products",
    secondaryLink: "/products",
    primaryText: "Shop Now",
    secondaryText: "Explore Deals"
  },
  {
    badge: "💳 Bank Discount Special",
    title: "Festive Season\nSuper Deals",
    subtitle: "Unlock instant bank discounts up to 10% on leading credit cards. Plus free delivery on all orders!",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1920&q=80",
    primaryLink: "/products",
    secondaryLink: "/products",
    primaryText: "Claim Discount",
    secondaryText: "Browse Categories"
  },
  {
    badge: "🚀 New Arrival",
    title: "Upgrade Your\nGear Today",
    subtitle: "The new line of high-performance laptops and smartwatches has arrived. Experience pure power.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80",
    primaryLink: "/products",
    secondaryLink: "/products",
    primaryText: "Pre-order Now",
    secondaryText: "View Specs"
  }
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section className="hero-carousel-container">
      <div className="hero-slides-wrapper">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === currentSlide ? "active" : ""}`}
            style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url(${slide.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translateX(${(idx - currentSlide) * 100}%)`,
              transition: "transform 0.8s ease-in-out"
            }}
          >
            <div className="hero-content">
              <span className="hero-badge">{slide.badge}</span>
              <h1 style={{ whiteSpace: "pre-line" }}>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <div className="hero-actions">
                <Link to={slide.primaryLink} className="btn btn--primary">
                  {slide.primaryText}
                </Link>
                <Link to={slide.secondaryLink} className="btn btn--secondary">
                  {slide.secondaryText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-arrow prev" onClick={handlePrev} aria-label="Previous slide">
        ❮
      </button>
      <button className="carousel-arrow next" onClick={handleNext} aria-label="Next slide">
        ❯
      </button>

      {/* Navigation Dots */}
      <div className="carousel-dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`carousel-dot ${idx === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
