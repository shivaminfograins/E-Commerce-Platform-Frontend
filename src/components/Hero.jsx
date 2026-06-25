import { Link } from "react-router-dom";
function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">🔥 Limited Time Offer</span>

        <h1>
          Discover Premium
          <br />
          Tech Products
        </h1>

        <p>
          Explore the latest smartphones, laptops, accessories and fashion
          products at unbeatable prices.
        </p>

        <div className="hero-actions">
          <Link to="/products" className="btn btn--primary">Shop Now</Link>

          <Link to="/products" className="btn btn--secondary">Explore Deals</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
