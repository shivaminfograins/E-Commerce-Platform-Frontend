import React, { useState, useEffect } from "react";

function FloatingWidgets() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="floating-widgets-container">
      {/* Scroll to Top */}
      <button
        className={`scroll-top-btn ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="20"
          height="20"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* Floating Chat / Help Center Widget */}
      <div className={`chat-widget-wrapper ${isChatOpen ? "active" : ""}`}>
        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-agent-info">
                <span className="chat-avatar-status">🟢</span>
                <div>
                  <h4>ShopEase Help</h4>
                  <span>Online | Usually replies instantly</span>
                </div>
              </div>
              <button
                className="chat-close-btn"
                onClick={() => setIsChatOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="chat-body">
              <div className="chat-message agent">
                <p>Hello there! 👋 How can we help you today?</p>
              </div>
              <div className="chat-message user-suggestion" onClick={() => alert("Redirecting to track orders...")}>
                🔍 Track my order
              </div>
              <div className="chat-message user-suggestion" onClick={() => alert("Opening support ticket...")}>
                🛠️ Contact Support
              </div>
            </div>
            <div className="chat-footer">
              <input type="text" placeholder="Type a message..." disabled />
              <button className="chat-send-btn" disabled>
                Send
              </button>
            </div>
          </div>
        )}
        <button
          className="chat-toggle-btn"
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Open support chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            className="chat-icon-svg"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default FloatingWidgets;
