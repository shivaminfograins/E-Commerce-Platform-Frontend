import React from "react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    rating: 5,
    comment: "The delivery was exceptionally fast, and the packaging was premium. The laptop is working perfectly. Best support team!",
    avatar: "👩‍💼"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Tech Enthusiast",
    rating: 5,
    comment: "Absolutely genuine product. I was worried about purchasing a smartphone online, but the experience was flawless.",
    avatar: "👨‍💻"
  },
  {
    id: 3,
    name: "Emma Watson",
    role: "Regular Customer",
    rating: 4,
    comment: "Great customer service. I had a slight issue with my address, but they fixed it in minutes. Highly recommend ShopEase!",
    avatar: "👩"
  }
];

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="section-header">
        <div>
          <h2>What Our Customers Say</h2>
          <p className="section-subtitle">Real experiences from our verified community</p>
        </div>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">{t.avatar}</div>
              <div className="testimonial-meta">
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>
            </div>
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < t.rating ? "#f59e0b" : "#e2e8f0"}
                  className="star-icon"
                  width="16"
                  height="16"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p className="testimonial-comment">"{t.comment}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
