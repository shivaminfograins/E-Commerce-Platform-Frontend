import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import orderService from "../services/orderService";
import cartService from "../services/cartService";
import api from "../api/axios";

// Import subcomponents
import OrderDetailHeader from "../components/orders/OrderDetail/OrderDetailHeader";
import OrderDetailTracking from "../components/orders/OrderDetail/OrderDetailTracking";
import OrderDetailItems from "../components/orders/OrderDetail/OrderDetailItems";
import OrderDetailSummary from "../components/orders/OrderDetail/OrderDetailSummary";
import OrderDetailPriceBreakdown from "../components/orders/OrderDetail/OrderDetailPriceBreakdown";
import TaxInvoicePreview from "../components/orders/OrderDetail/TaxInvoicePreview";

function OrderDetail({ cart = {}, wishlist = [], user, setUser, setCart }) {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  // Add print styles to document when component mounts
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        /* Render ONLY the TaxInvoicePreview container when printing */
        .tax-invoice-printable-container, .tax-invoice-printable-container * {
          visibility: visible !important;
        }
        .tax-invoice-printable-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (orderId) {
      const fetchDetail = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await orderService.getOrderDetail(orderId);
          if (response.data.success) {
            setOrder(response.data.order);
          } else {
            setError("Failed to load order details.");
          }
        } catch (err) {
          console.error("Failed to load order:", err);
          setError("Error fetching order details. Make sure the order exists.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [orderId, user, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const response = await orderService.cancelOrder(orderId);
      if (response.data.success) {
        alert("Order cancelled successfully.");
        // Refresh details
        const refreshResponse = await orderService.getOrderDetail(orderId);
        if (refreshResponse.data.success) {
          setOrder(refreshResponse.data.order);
        }
      } else {
        alert(response.data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error("Cancel failed:", err);
      const msg = err?.response?.data?.message || "Failed to cancel order.";
      alert(msg);
    } finally {
      setCancelling(false);
    }
  };

  const handleBuyAgain = async (variantId) => {
    if (!variantId) {
      alert("This item variant is currently unavailable.");
      return;
    }
    try {
      const response = await cartService.addToCart(variantId, 1);
      if (typeof setCart === "function") {
        setCart(response.data);
      }
      alert("Added to cart successfully.");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add item to cart. It might be out of stock.");
    }
  };

  const handlePrintInvoice = () => {
    // Open full print preview modal or directly trigger browser print
    setShowInvoicePreview(true);
  };

  const handleDownloadPDF = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const response = await api.get(`/orders/${orderId}/invoice/`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Tax_Invoice_${order.order_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download PDF invoice:", err);
      alert("Failed to download official invoice PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <MainLayout
      cartCount={cartCount}
      wishlistCount={wishlist.length}
      user={user}
      setUser={setUser}
    >
      <div className="container" style={{ padding: "40px 20px", maxWidth: "1100px", margin: "0 auto" }}>
        {loading ? (
          // Loading Skeleton
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "40px 0" }}>
            <div style={{ height: "40px", width: "300px", background: "#e2e8f0", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
            <div style={{ height: "180px", width: "100%", background: "#e2e8f0", borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <div style={{ flex: 2, height: "300px", background: "#e2e8f0", borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
              <div style={{ flex: 1, height: "300px", background: "#e2e8f0", borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
            </div>
          </div>
        ) : error ? (
          // Error State
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <span style={{ fontSize: "48px" }}>⚠️</span>
            <h2 style={{ fontSize: "20px", color: "#0f172a", margin: "16px 0 8px 0" }}>Something went wrong</h2>
            <p style={{ color: "#ef4444", fontSize: "15px", margin: "0 0 24px 0" }}>{error}</p>
            <button
              onClick={() => navigate("/orders")}
              style={{
                background: "#4f46e5",
                color: "#ffffff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Back to Orders
            </button>
          </div>
        ) : order ? (
          // Main Order details content wrapper
          <div className="order-detail-print-area" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Header */}
            <OrderDetailHeader
              order={order}
              onPrintInvoice={handlePrintInvoice}
              onDownloadPDF={handleDownloadPDF}
            />

            {/* Tracking Status */}
            <OrderDetailTracking order={order} />

            {/* Responsive grid split layout */}
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              
              {/* Left main area: Items and Summary */}
              <div style={{ flex: "2 1 600px", display: "flex", flexDirection: "column", gap: "24px" }}>
                <OrderDetailItems order={order} onBuyAgain={handleBuyAgain} />
                <OrderDetailSummary order={order} cancelling={cancelling} onCancelOrder={handleCancelOrder} />
              </div>

              {/* Right Sidebar: Cost Breakdown */}
              <div style={{ flex: "1 1 300px", height: "fit-content" }}>
                <OrderDetailPriceBreakdown order={order} />
              </div>
            </div>

            {/* Hidden TaxInvoicePreview rendered in background for print engine */}
            <div style={{ display: "none" }}>
              <TaxInvoicePreview order={order} />
            </div>

            {/* Print Preview Modal overlay */}
            {showInvoicePreview && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(15, 23, 42, 0.7)",
                  zIndex: 2000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  backdropFilter: "blur(4px)",
                }}
                onClick={() => setShowInvoicePreview(false)}
              >
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "860px",
                    maxHeight: "90vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#f8fafc",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                      Invoice Print Preview
                    </h3>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => window.print()}
                        style={{
                          background: "#0f172a",
                          color: "#ffffff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Print Now
                      </button>
                      <button
                        onClick={() => setShowInvoicePreview(false)}
                        style={{
                          background: "#ffffff",
                          color: "#475569",
                          border: "1px solid #cbd5e1",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Modal Body with invoice preview scroll */}
                  <div style={{ flex: 1, overflowY: "auto", padding: "24px", background: "#f1f5f9" }}>
                    <TaxInvoicePreview order={order} />
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}

export default OrderDetail;
