import { useState, useEffect } from "react";
import couponService from "../services/couponService";

const FALLBACK_COUPONS = [
  {
    id: "fb-1",
    code: "WELCOME10",
    description: "Get 10% off on your first order",
    discount_type: "percentage",
    discount_value: 10,
    min_purchase_amount: 500,
    is_active: true,
  },
  {
    id: "fb-2",
    code: "TECH40",
    description: "Upgrade your setup with flat discount",
    discount_type: "fixed",
    discount_value: 400,
    min_purchase_amount: 3000,
    is_active: true,
  },
  {
    id: "fb-3",
    code: "SUPERDEAL20",
    description: "Save big on summer fashion & accessories",
    discount_type: "percentage",
    discount_value: 20,
    min_purchase_amount: 1500,
    is_active: true,
  },
  {
    id: "fb-4",
    code: "FREESHIP",
    description: "Free delivery on premium brands",
    discount_type: "fixed",
    discount_value: 150,
    min_purchase_amount: 1000,
    is_active: true,
  },
];

function CouponSection() {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        setLoading(true);
        // Try fetching active coupons from API
        const response = await couponService.getCoupons();
        const results = response?.data?.results || response?.data || [];
        
        // Filter active & non-expired ones if available
        const active = results.filter(
          (c) => c.is_active && (!c.end_date || new Date(c.end_date) > new Date())
        );

        if (active.length > 0) {
          setCoupons(active.slice(0, 4));
        } else {
          setCoupons(FALLBACK_COUPONS);
        }
      } catch (err) {
        console.warn("Failed to fetch coupons from server, using fallback coupons:", err);
        setCoupons(FALLBACK_COUPONS);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCoupons();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  if (loading && coupons.length === 0) {
    return null; // hide or show minimal loader if empty
  }

  if (coupons.length === 0) {
    return null;
  }

  return (
    <section className="homepage-section-block coupons-section">
      <div className="section-header-row">
        <div className="header-title-side">
          <h2>Special Offers & Coupons</h2>
          <span className="live-badge">💡 Click code to copy and apply at checkout</span>
        </div>
      </div>
      <div className="coupons-grid">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="coupon-ticket">
            <div className="coupon-ticket__left">
              <div className="coupon-discount-badge">
                {coupon.discount_type === "percentage"
                  ? `${Math.round(parseFloat(coupon.discount_value))}%`
                  : `₹${Math.round(parseFloat(coupon.discount_value))}`}
                <span className="coupon-discount-lbl">OFF</span>
              </div>
            </div>
            
            <div className="coupon-ticket__divider">
              <span className="notch notch-top"></span>
              <span className="notch notch-bottom"></span>
            </div>

            <div className="coupon-ticket__right">
              <div className="coupon-info">
                <span className="coupon-min-spend">
                  Min Spend: ₹{Math.round(parseFloat(coupon.min_purchase_amount))}
                </span>
                <p className="coupon-desc">{coupon.description}</p>
                <div className="coupon-copy-wrapper">
                  <button 
                    onClick={() => handleCopy(coupon.code)}
                    className={`coupon-code-btn ${copiedCode === coupon.code ? "copied" : ""}`}
                  >
                    <span className="coupon-code-txt">{coupon.code}</span>
                    <span className="coupon-copy-hint">
                      {copiedCode === coupon.code ? "Copied!" : "Copy"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CouponSection;
