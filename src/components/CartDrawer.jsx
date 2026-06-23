function CartDrawer({ isOpen, cartItems, onClose }) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Shopping Cart</h2>

        <button onClick={onClose}>✕</button>
      </div>

      <div className="cart-body">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />

            <div>
              <h4>{item.name}</h4>

              <p>₹{item.price.toLocaleString()}</p>

              <p>Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <h3>Total ₹{total.toLocaleString()}</h3>

        <button className="btn btn--primary">Checkout</button>
      </div>
    </div>
  );
}

export default CartDrawer;
