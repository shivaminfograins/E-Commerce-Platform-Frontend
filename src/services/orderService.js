import api from "../api/axios";

const orderService = {
  // Place a new order
  placeOrder: async (orderData) => {
    return api.post("/orders/", orderData);
  },

  // Get paginated orders list
  getOrders: async (params = {}) => {
    return api.get("/orders/list/", { params });
  },

  // Get single order detail by orderNumber or ID
  getOrderDetail: async (orderNumber) => {
    return api.get(`/orders/${orderNumber}/`);
  },

  // Get shipment tracking info for multi-vendor order
  getOrderTracking: async (orderNumber) => {
    return api.get(`/orders/${orderNumber}/tracking/`);
  },

  // Cancel master order
  cancelOrder: async (orderNumber) => {
    return api.post(`/orders/${orderNumber}/cancel/`);
  },

  // Cancel specific vendor sub-order
  cancelVendorOrder: async (orderNumber, vendorOrderNumber) => {
    return api.post(`/orders/${orderNumber}/vendors/${vendorOrderNumber}/cancel/`);
  },

  // Get return requests for an order
  getOrderReturns: async (orderNumber) => {
    return api.get(`/orders/${orderNumber}/returns/`);
  },
};

export default orderService;
