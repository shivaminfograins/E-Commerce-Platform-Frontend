import { Link } from "react-router-dom";

function CartModal({ isOpen, cartItems, onClose, onAdd, onRemove }) {
  if (!isOpen) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-modal-backdrop" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Shopping Cart</h2>
          <button className="cart-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-modal-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="empty-cart-icon"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-modal-item">
                <img src={item.image} alt={item.name} className="cart-modal-item-img" />
                <div className="cart-modal-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-modal-item-price">₹{item.price.toLocaleString()}</p>
                  <div className="cart-modal-qty">
                    <span className="qty-label">Qty:</span>
                    <button className="cart-modal-qty-btn" onClick={() => onRemove(item.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <span className="cart-modal-qty-val">{item.quantity}</span>
                    <button className="cart-modal-qty-btn" onClick={() => onAdd(item.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-modal-total">
              <span>Total:</span>
              <span className="cart-modal-total-val">₹{total.toLocaleString()}</span>
            </div>
            <div className="cart-modal-actions">
              <Link to="/cart" className="btn btn--secondary cart-modal-btn" onClick={onClose}>
                View Cart
              </Link>
              <button className="btn btn--primary cart-modal-btn" onClick={() => alert("Checkout successful!")}>
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModal;
