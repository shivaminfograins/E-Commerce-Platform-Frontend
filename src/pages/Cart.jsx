import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CheckoutModal from "../components/checkout/CheckoutModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import cartService from "../services/cartService";

/**
 * Cart.jsx  (full Cart page)
 *
 * Changes from previous version:
 *  - Accepts `cartItems` from App where each item now has the shape
 *    returned by the backend after the ProductVariant migration:
 *      {
 *        id,            // CartItem PK
 *        product_id,
 *        product_name,
 *        variant_id,
 *        variant_name,
 *        sku,
 *        price,         // string or number
 *        stock,
 *        image,
 *        quantity,
 *        subtotal,
 *      }
 *
 *  - Quantity PATCH calls use variant_id (not CartItem id) — matches
 *    the backend route: PATCH /cart/<variant_id>/
 *
 *  - DELETE calls use variant_id for the same reason.
 *
 *  - Subtotals and cart total come from the backend where possible;
 *    we recalculate locally only for the UI so we don't wait for a
 *    round-trip on every interaction.
 *
 *  - Each row shows: image, product_name, variant_name, SKU, price,
 *    qty control, subtotal, delete button.
 *
 *  - "Clear Cart" button added.
 */
function Cart({ cart, cartItems = [], setCart, wishlist = [], user, setUser }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [updating, setUpdating] = useState(null); // variant_id of the item being updated
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Recalculate subtotal locally (backend also returns it but we want
  // immediate UI feedback without waiting for API response).
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    if (location.state?.autoCheckout) {
      if (!user) {
        window.alert("Please log in to proceed to checkout.");
        navigate("/login", { state: { from: "/cart" }, replace: true });
        return;
      }
      setCheckoutOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, user]);

  const handleCheckoutClick = () => {
    if (!user) {
      window.alert("Please log in to proceed to checkout.");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    setCheckoutOpen(true);
  };

  // ── Quantity increment ─────────────────────────────────────
  const handleAdd = async (item) => {
    if (updating === item.variant_id) return;
    const newQty = item.quantity + 1;
    if (newQty > item.stock) return; // respect stock limit
    setUpdating(item.variant_id);
    try {
      const response = await cartService.updateQuantity(
        item.variant_id,
        newQty,
      );
      setCart(response.data);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setUpdating(null);
    }
  };

  // ── Quantity decrement ─────────────────────────────────────
  const handleRemove = async (item) => {
    if (updating === item.variant_id) return;
    if (item.quantity <= 1) {
      // Decrementing below 1 removes the item entirely
      return handleDelete(item);
    }
    const newQty = item.quantity - 1;
    setUpdating(item.variant_id);
    try {
      const response = await cartService.updateQuantity(
        item.variant_id,
        newQty,
      );
      setCart(response.data);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setUpdating(null);
    }
  };

  // ── Delete item ────────────────────────────────────────────
  const handleDelete = async (item) => {
    if (updating === item.variant_id) return;
    setUpdating(item.variant_id);
    try {
      const response = await cartService.removeFromCart(item.variant_id);
      setCart(response.data);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setUpdating(null);
    }
  };

  // ── Clear entire cart ──────────────────────────────────────
  const handleClearCart = async () => {
    if (!window.confirm("Remove all items from your cart?")) return;
    try {
      const response = await cartService.clearCart();
      setCart(response.data);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        search=""
        setSearch={() => {}}
        onCartClick={() => {}}
        onWishlistClick={() => navigate("/wishlist")}
        user={user}
        setUser={setUser}
      />

      <Breadcrumbs />

      <main className="container page-cart-container">
        <h1 className="cart-page-title">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          /* ── Empty state ──────────────────────────────────── */
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
            <p>
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Link to="/" className="btn btn--primary empty-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* ── Cart layout ──────────────────────────────────── */
          <div className="cart-page-layout">
            {/* Cart Items List */}
            <div className="cart-page-list">
              {/* Clear cart header action */}
              <div className="cart-list-header">
                <span className="cart-item-count">
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </span>
                <button
                  className="btn btn--ghost btn--clear-cart"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item) => {
                const isUpdating = updating === item.variant_id;
                const lineSubtotal = Number(item.price) * item.quantity;

                return (
                  <div
                    key={item.variant_id ?? item.id}
                    className={`cart-page-item${isUpdating ? " cart-page-item--loading" : ""}`}
                  >
                    {/* Product Image */}
                    <img
                      src={item.image || ""}
                      alt={item.product_name}
                      className="cart-page-item-img"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />

                    {/* Item Details */}
                    <div className="cart-page-item-info">
                      {/* Product & Variant names */}
                      <h3 className="cart-item-product-name">
                        {item.product_name}
                      </h3>
                      <p className="cart-item-variant-name">
                        {item.variant_name}
                      </p>

                      {/* SKU */}
                      <p className="cart-item-sku">
                        SKU: <span>{item.sku}</span>
                      </p>

                      {/* Unit price */}
                      <p className="cart-page-item-price">
                        ₹{Number(item.price).toLocaleString()} / unit
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="cart-page-item-qty">
                      <button
                        className="qty-btn"
                        onClick={() => handleRemove(item)}
                        disabled={isUpdating}
                        aria-label="Decrease quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn qty-btn--add"
                        onClick={() => handleAdd(item)}
                        disabled={isUpdating || item.quantity >= item.stock}
                        aria-label="Increase quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>

                    {/* Line Subtotal */}
                    <div className="cart-page-item-total">
                      ₹{lineSubtotal.toLocaleString()}
                    </div>

                    {/* Delete button */}
                    <button
                      className="cart-page-item-delete"
                      onClick={() => handleDelete(item)}
                      disabled={isUpdating}
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
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
              {shipping > 0 && (
                <p className="shipping-note">
                  Free shipping on orders above ₹999
                </p>
              )}
              <div className="summary-row divider">
                <span>Total</span>
                <span className="summary-total-val">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <button
                className="btn btn--primary btn--checkout"
                onClick={handleCheckoutClick}
              >
                Proceed to Checkout
              </button>
              <Link to="/" className="continue-shopping-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        onOrderSuccess={() => setCart({})}
        user={user}
      />

      <Footer />
    </>
  );
}

export default Cart;
