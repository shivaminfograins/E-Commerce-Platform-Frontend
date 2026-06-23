function Newsletter() {
  return (
    <section className="newsletter">
      <h2>Subscribe Newsletter</h2>

      <p>Get updates about new products and special offers.</p>

      <div className="newsletter-box">
        <input
          type="email"
          placeholder="Enter Email"
          className="newsletter-input"
        />

        <button className="newsletter-btn">Subscribe</button>
      </div>
    </section>
  );
}

export default Newsletter;
