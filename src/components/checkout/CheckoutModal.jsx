import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./checkout.css";
import addressService from "../../services/addressService";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";

/* ── script helper ─────────────────────────────────────── */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* ── tiny icon helpers ─────────────────────────────────── */
const IconClose = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCheckCircle = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#successGrad)"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <defs>
      <linearGradient id="successGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6c63ff" />
        <stop offset="100%" stopColor="#48cfad" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" />
    <polyline points="8 12.5 11 15.5 16 9" />
  </svg>
);

const IconLocation = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconTruck = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <path d="M16 8h4l3 4v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconCreditCard = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconReceipt = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);

/* ── main component ────────────────────────────────────── */
function CheckoutModal({
  open,
  onClose,
  cartItems = [],
  subtotal = 0,
  shipping = 0,
  total = 0,
  onOrderSuccess,
  user,
}) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);
  const navigate = useNavigate();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    full_name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    is_default: true,
  });
  const [savingAddr, setSavingAddr] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSaveAddress = async () => {
    if (
      !newAddr.full_name.trim() ||
      !newAddr.address_line_1.trim() ||
      !newAddr.city.trim() ||
      !newAddr.state.trim() ||
      !newAddr.postal_code.trim() ||
      !newAddr.phone.trim()
    ) {
      setFormError("Please fill out all required fields.");
      return;
    }

    setSavingAddr(true);
    setFormError("");
    try {
      const saved = await addressService.createAddress(newAddr);
      const updatedList = await addressService.getAddresses();
      setAddresses(updatedList);
      if (saved && saved.id) {
        setSelectedAddr(saved.id);
      } else if (updatedList.length > 0) {
        setSelectedAddr(updatedList[updatedList.length - 1].id);
      }
      setNewAddr({
        full_name: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        phone: "",
        is_default: true,
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      setFormError("Failed to save address. Please check your inputs.");
    } finally {
      setSavingAddr(false);
    }
  };

  // Fetch addresses dynamically from DB
  useEffect(() => {
    if (open && !user) {
      onClose();
      window.alert("Please log in to proceed to checkout.");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (open) {
      const fetchAddresses = async () => {
        try {
          const data = await addressService.getAddresses();
          setAddresses(data);
          if (data.length > 0) {
            // Find default address or pick first
            const defaultAddr = data.find((a) => a.is_default) || data[0];
            setSelectedAddr(defaultAddr.id);
          }
        } catch (err) {
          console.error("Failed to load addresses:", err);
        }
      };
      fetchAddresses();
    }
  }, [open]);

  if (!open) return null;

  const handlePlaceOrder = async () => {
    const selectedAddress = addresses.find((a) => a.id === selectedAddr);
    if (!user) {
      window.alert("Please log in to proceed to checkout.");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (!selectedAddr) {
      setErrorMsg("Please select or add a delivery address.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Create order on the backend first
      const response = await orderService.placeOrder({
        address: selectedAddr,
        payment_method: payment,
      });

      if (response.data.success) {
        const orderData = response.data.order;
        setPlacedOrderInfo(orderData);

        // 2. Handle Razorpay Checkout Modal
        if (payment === "razorpay") {
          const scriptLoaded = await loadRazorpayScript();
          if (!scriptLoaded) {
            setErrorMsg(
              "Failed to load Razorpay payment gateway. Please check your internet connection.",
            );
            setLoading(false);
            return;
          }

          const keyId =
            import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mockkeyid123";

          const options = {
            key: keyId,
            amount: Math.round(Number(orderData.total_amount) * 100), // in paise
            currency: "INR",
            name: "ShopEase",
            description: `Payment for Order #${orderData.order_number}`,
            order_id: orderData.razorpay_order_id,
            prefill: {
              name: selectedAddress?.full_name || "",
              email: user?.email || "customer@example.com",
              contact: selectedAddress?.phone
                ? selectedAddress.phone.replace(/[^0-9]/g, "")
                : "",
            },
            theme: {
              color: "#7c3aed",
            },
            handler: async function (paymentResponse) {
              setLoading(true);
              try {
                // Verify signature on backend
                const verifyResponse = await paymentService.verifyPayment({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                });

                if (verifyResponse.data.success) {
                  setSuccess(true);
                  if (typeof onOrderSuccess === "function") {
                    onOrderSuccess();
                  }
                } else {
                  setErrorMsg(
                    verifyResponse.data.message ||
                      "Payment verification failed.",
                  );
                }
              } catch (verifyErr) {
                console.error("Verification failed:", verifyErr);
                setErrorMsg(
                  "Payment verification failed. Please contact customer support.",
                );
              } finally {
                setLoading(false);
              }
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                setErrorMsg(
                  "Payment cancelled by user. You can retry from your orders page.",
                );
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // COD checkout successfully complete
          setSuccess(true);
          if (typeof onOrderSuccess === "function") {
            onOrderSuccess();
          }
          setLoading(false);
        }
      } else {
        setErrorMsg(response.data.message || "Failed to place order.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Place order failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "An error occurred while placing your order.";
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setLoading(false);
    setErrorMsg("");
    setPlacedOrderInfo(null);
    onClose();
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddr);

  return (
    <div className="co-overlay" onClick={handleClose}>
      <div
        className={`co-modal ${success ? "co-modal--success" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── success screen ── */}
        {success ? (
          <div className="co-success">
            <IconCheckCircle />
            <h2 className="co-success__title">Order Placed! 🎉</h2>
            <p className="co-success__sub">
              Your order <strong>#{placedOrderInfo?.order_number}</strong> has
              been confirmed.
            </p>
            <div className="co-success__detail">
              <div className="co-success__detail-row">
                <span>Order Total</span>
                <strong>
                  ₹
                  {Number(
                    placedOrderInfo?.total_amount || total,
                  ).toLocaleString()}
                </strong>
              </div>
              <div className="co-success__detail-row">
                <span>Payment</span>
                <strong>
                  {payment === "cod" ? "Cash on Delivery" : "Razorpay Online"}
                </strong>
              </div>
              <div className="co-success__detail-row">
                <span>Deliver to</span>
                <strong>
                  {placedOrderInfo?.snapshot_full_name ||
                    selectedAddress?.full_name}
                </strong>
              </div>
            </div>
            <button
              className="co-btn co-btn--primary co-success__cta"
              onClick={handleClose}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* ── header ── */}
            <div className="co-header">
              <div className="co-header__left">
                <span className="co-header__badge">Checkout</span>
                <h2 className="co-header__title">Complete Your Order</h2>
              </div>
              <button
                className="co-close"
                onClick={handleClose}
                aria-label="Close"
              >
                <IconClose />
              </button>
            </div>

            {/* ── scrollable body ── */}
            <div className="co-body">
              {/* Error Alert */}
              {errorMsg && (
                <div
                  style={{
                    padding: "12px",
                    background: "#fef2f2",
                    border: "1px solid #fee2e2",
                    color: "#b91c1c",
                    borderRadius: "10px",
                    margin: "10px 20px 0 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* ─ Delivery Address ─ */}
              <section className="co-section">
                <div className="co-section__heading">
                  <span className="co-section__icon">
                    <IconLocation />
                  </span>
                  <h3>Delivery Address</h3>
                </div>

                <div className="co-addr-list">
                  {addresses.length === 0 ? (
                    <div
                      style={{
                        padding: "16px",
                        color: "#64748b",
                        fontSize: "14px",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      No saved addresses found. Please add an address to
                      continue checkout.
                    </div>
                  ) : (
                    addresses.map((a) => (
                      <label
                        key={a.id}
                        className={`co-addr-card ${selectedAddr === a.id ? "co-addr-card--active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="co-addr-radio"
                          checked={selectedAddr === a.id}
                          onChange={() => setSelectedAddr(a.id)}
                        />
                        <div className="co-addr-info">
                          <span className="co-addr-tag">
                            {a.is_default ? "Default" : "Address"}
                          </span>
                          <p className="co-addr-name">{a.full_name}</p>
                          <p className="co-addr-line">{`${a.address_line_1}, ${a.address_line_2 ? a.address_line_2 + ", " : ""}${a.city}, ${a.state} – ${a.postal_code}`}</p>
                          <p className="co-addr-mobile">📱 {a.phone}</p>
                        </div>
                        {selectedAddr === a.id && (
                          <span className="co-addr-check">✓</span>
                        )}
                      </label>
                    ))
                  )}
                </div>

                {!showAddForm ? (
                  <button
                    type="button"
                    className="co-add-addr-btn"
                    onClick={() => {
                      setShowAddForm(true);
                      setFormError("");
                    }}
                  >
                    + Add New Address
                  </button>
                ) : (
                  <div className="co-add-addr-form">
                    <h4 className="co-form-title">Add New Delivery Address</h4>
                    {formError && <p className="co-form-error-msg">⚠️ {formError}</p>}
                    <div className="co-form-row">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newAddr.full_name}
                        onChange={(e) => setNewAddr({ ...newAddr, full_name: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="co-form-row">
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={newAddr.address_line_1}
                        onChange={(e) => setNewAddr({ ...newAddr, address_line_1: e.target.value })}
                        required
                      />
                    </div>
                    <div className="co-form-row">
                      <input
                        type="text"
                        placeholder="Address Line 2 (Optional)"
                        value={newAddr.address_line_2}
                        onChange={(e) => setNewAddr({ ...newAddr, address_line_2: e.target.value })}
                      />
                    </div>
                    <div className="co-form-row co-form-row--three">
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={newAddr.postal_code}
                        onChange={(e) => setNewAddr({ ...newAddr, postal_code: e.target.value })}
                        required
                      />
                    </div>
                    <div className="co-form-actions">
                      <button
                        type="button"
                        className="co-btn co-btn--cancel"
                        onClick={() => setShowAddForm(false)}
                        disabled={savingAddr}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="co-btn co-btn--save"
                        onClick={handleSaveAddress}
                        disabled={savingAddr}
                      >
                        {savingAddr ? "Saving..." : "Save Address"}
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* ─ Delivery Info ─ */}
              <section className="co-section">
                <div className="co-section__heading">
                  <span className="co-section__icon">
                    <IconTruck />
                  </span>
                  <h3>Delivery</h3>
                </div>
                <div className="co-delivery-pills">
                  <span className="co-pill co-pill--green">
                    ✓ FREE Delivery
                  </span>
                  <span className="co-pill co-pill--blue">
                    ⚡ Arrives Tomorrow
                  </span>
                </div>
              </section>

              {/* ─ Payment ─ */}
              <section className="co-section">
                <div className="co-section__heading">
                  <span className="co-section__icon">
                    <IconCreditCard />
                  </span>
                  <h3>Payment Method</h3>
                </div>
                <div className="co-payment-options">
                  <label
                    className={`co-pay-card ${payment === "cod" ? "co-pay-card--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      className="co-addr-radio"
                      checked={payment === "cod"}
                      onChange={() => setPayment("cod")}
                    />
                    <span className="co-pay-icon">💵</span>
                    <div>
                      <p className="co-pay-label">Cash on Delivery</p>
                      <p className="co-pay-sub">Pay when your order arrives</p>
                    </div>
                  </label>

                  <label
                    className={`co-pay-card ${payment === "razorpay" ? "co-pay-card--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      className="co-addr-radio"
                      checked={payment === "razorpay"}
                      onChange={() => setPayment("razorpay")}
                    />
                    <span className="co-pay-icon">💳</span>
                    <div>
                      <p className="co-pay-label">Razorpay Online</p>
                      <p className="co-pay-sub">
                        Cards, UPI, Netbanking, Wallet
                      </p>
                    </div>
                  </label>
                </div>
              </section>

              {/* ─ Order Summary ─ */}
              <section className="co-section co-section--last">
                <div className="co-section__heading">
                  <span className="co-section__icon">
                    <IconReceipt />
                  </span>
                  <h3>Order Summary</h3>
                </div>

                {cartItems.length > 0 && (
                  <div className="co-items-preview">
                    {cartItems.slice(0, 2).map((item) => (
                      <div key={item.id} className="co-item-row">
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="co-item-img"
                        />
                        <span className="co-item-name">
                          {item.product_name}
                        </span>
                        <span className="co-item-price">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {cartItems.length > 2 && (
                      <p className="co-items-more">
                        +{cartItems.length - 2} more item(s)
                      </p>
                    )}
                  </div>
                )}

                <div className="co-summary-rows">
                  <div className="co-summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="co-summary-row">
                    <span>Shipping</span>
                    <span className="co-free">
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="co-summary-row co-summary-row--total">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* ── sticky footer / place order ── */}
            <div className="co-footer">
              <div className="co-footer__meta">
                <p className="co-footer__total-label">You Pay</p>
                <p className="co-footer__total-val">
                  ₹{total.toLocaleString()}
                </p>
              </div>
              <button
                id="place-order-btn"
                className={`co-btn co-btn--primary co-btn--place ${loading ? "co-btn--loading" : ""}`}
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <span className="co-spinner" />
                ) : (
                  <>
                    <span>Place Order</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
