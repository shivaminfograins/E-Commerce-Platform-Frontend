import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cart({ cart, setCart }) {
  const products = [
    { id: 1, name: "iPhone 15 Pro", price: 139999, image: "/images/iphone.jpg" },
    { id: 2, name: "Samsung S24 Ultra", price: 119999, image: "/images/samsung.jpg" },
    { id: 3, name: "MacBook Pro", price: 199999, image: "/images/macbook.jpg" },
    { id: 4, name: "Dell XPS 15", price: 149999, image: "/images/dell-xps.jpg" },
    { id: 5, name: "AirPods Pro", price: 24999, image: "/images/airpods.jpg" },
    { id: 6, name: "Mechanical Keyboard", price: 9999, image: "/images/keyboard.jpg" },
    { id: 7, name: "Leather Jacket", price: 12999, image: "/images/jacket.jpg" },
    { id: 8, name: "Running Sneakers", price: 7999, image: "/images/sneakers.jpg" },
    { id: 9, name: "Google Pixel 8 Pro", price: 109999, image: "/images/pixel.jpg" },
    { id: 10, name: "OnePlus 12", price: 64999, image: "/images/oneplus.jpg" },
    { id: 11, name: "Asus ROG Zephyrus", price: 159999, image: "/images/asus-rog.jpg" },
    { id: 12, name: "Wireless Gaming Mouse", price: 6999, image: "/images/mouse.jpg" },
    { id: 13, name: "Smart Fitness Watch", price: 19999, image: "/images/smartwatch.jpg" },
    { id: 14, name: "Denim Jacket", price: 4999, image: "/images/denim-jacket.jpg" },
    { id: 15, name: "Classic Sunglasses", price: 3999, image: "/images/sunglasses.jpg" },
    { id: 16, name: "Casual Canvas Shoes", price: 3499, image: "/images/canvas-shoes.jpg" },
    { id: 17, name: "Leather Boots", price: 8999, image: "/images/boots.jpg" },
    { id: 18, name: "Noise Cancelling Headphones", price: 29999, image: "/images/headphones.jpg" },
  ];

  const cartItems = products
    .filter((product) => cart[product.id])
    .map((product) => ({
      ...product,
      quantity: cart[product.id],
    }));

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleAdd = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemove = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const handleDelete = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  return (
    <>
      <Navbar cartCount={cartCount} search="" setSearch={() => {}} onCartClick={() => {}} />

      <main className="container page-cart-container">
        <h1 className="cart-page-title">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="cart-page-empty">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="empty-cart-icon"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/" className="btn btn--primary empty-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-page-layout">
            {/* Cart Items List */}
            <div className="cart-page-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-page-item">
                  <img src={item.image} alt={item.name} className="cart-page-item-img" />
                  <div className="cart-page-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-page-item-price">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="cart-page-item-qty">
                    <button className="qty-btn" onClick={() => handleRemove(item.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn qty-btn--add" onClick={() => handleAdd(item.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                  <div className="cart-page-item-total">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button className="cart-page-item-delete" onClick={() => handleDelete(item.id)} aria-label="Delete item">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="cart-page-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="summary-row divider">
                <span>Total</span>
                <span className="summary-total-val">₹{total.toLocaleString()}</span>
              </div>
              <button className="btn btn--primary btn--checkout" onClick={() => alert("Checkout successful!")}>
                Proceed to Checkout
              </button>
              <Link to="/" className="continue-shopping-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Cart;
