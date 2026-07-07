import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import OrderFilter from "../components/orders/OrderFilter";
import OrderList from "../components/orders/OrderList";
import EmptyOrders from "../components/orders/EmptyOrders";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import orderService from "../services/orderService";

function MyOrders({ cart = {}, wishlist = [], user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 1,
    count: 0,
  });

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.page_size,
      };
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      // Status filtering handled by search or can be mapped to Django query search parameter
      if (statusFilter !== "All") {
        params.search = statusFilter.toLowerCase();
      }

      const response = await orderService.getOrders(params);
      const data = response.data;
      if (data.success) {
        setOrders(data.results);
        setPagination((prev) => ({
          ...prev,
          total_pages: data.total_pages,
          count: data.count,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, searchQuery, statusFilter, pagination.page, pagination.page_size]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleCancelSuccess = () => {
    // Refresh list and clear modal
    fetchOrders();
    setSelectedOrderId(null);
  };

  if (!user) return null;

  return (
    <MainLayout
      cartCount={cartCount}
      wishlistCount={wishlist.length}
      user={user}
      setUser={setUser}
    >
      <div className="container" style={{ padding: "40px 20px" }}>
        <h1 className="page-title" style={{ marginBottom: "8px", fontWeight: "800", color: "#0f172a" }}>My Orders</h1>
        <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "16px" }}>View and track your previous purchases</p>

        <OrderFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {loading ? (
          <p className="section-message">Loading your orders...</p>
        ) : error ? (
          <p className="section-message section-message--error">{error}</p>
        ) : orders.length > 0 ? (
          <>
            <OrderList 
              orders={orders.map((o) => ({
                id: o.id,
                orderNumber: o.order_number,
                status: o.status_display,
                rawStatus: o.status,
                total: o.total_amount,
                date: new Date(o.created_at).toLocaleDateString(),
                itemCount: o.item_count,
                image: o.first_item_image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150",
                productName: o.first_item_name || "Order Items",
                brand: o.coupon_code ? `Coupon: ${o.coupon_code}` : "ShopEase",
                quantity: o.item_count,
                price: o.total_amount,
              }))} 
              onViewDetails={(order) => setSelectedOrderId(order.id)} 
            />
            
            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px" }}>
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" }}
                >
                  Previous
                </button>
                <span style={{ alignSelf: "center", fontWeight: "600", fontSize: "14px" }}>
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <button
                  disabled={pagination.page >= pagination.total_pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyOrders />
        )}
      </div>

      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onCancelSuccess={handleCancelSuccess}
        />
      )}
    </MainLayout>
  );
}

export default MyOrders;
