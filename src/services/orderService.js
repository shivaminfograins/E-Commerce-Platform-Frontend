import api from "../api/axios";

const orderService = {
  // Place a new order
  placeOrder: async (orderData) => {
    // orderData: {
    //   address: id,
    //   payment_method: "cod"|"razorpay"|"stripe"|"upi",
    //   items: [{variant_id, quantity}, ...],
    //   coupon_code?,
    //   notes?
    // }
    return api.post("/orders/", orderData);
  },

  // Get paginated orders list
  getOrders: async (params = {}) => {
    // params: { page, page_size, search, ordering }
    return api.get("/orders/list/", { params });
  },

  // Get single order detail by ID
  getOrderDetail: async (id) => {
    return api.get(`/orders/${id}/`);
  },

  // Cancel an order
  cancelOrder: async (id) => {
    return api.patch(`/orders/${id}/cancel/`);
  },
};

export default orderService;
