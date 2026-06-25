import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import OrderFilter from "../components/orders/OrderFilter";
import OrderList from "../components/orders/OrderList";
import EmptyOrders from "../components/orders/EmptyOrders";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import orders from "../data/orders";

function MyOrders({ cart = {}, wishlist = [], user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!user) return null;

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

        {filteredOrders.length > 0 ? (
          <OrderList orders={filteredOrders} onViewDetails={setSelectedOrder} />
        ) : (
          <EmptyOrders />
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </MainLayout>
  );
}

export default MyOrders;
