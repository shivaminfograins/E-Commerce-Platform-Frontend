import api from "../../api/axios";

const orderService = {
  // Get all orders (with search, filter, pagination)
  getOrders: async (params = {}) => {
    const { search = "", status = "All", page = 1, limit = 5 } = params;
    const apiParams = { page, page_size: limit };

    if (search.trim()) {
      apiParams.search = search;
    }
    if (status !== "All") {
      apiParams.status = status.toLowerCase();
    }

    const response = await api.get("/admin/orders/", { params: apiParams });
    const results = response.data.results || response.data || [];
    const count = response.data.count || results.length;

    const mapped = results.map((o) => ({
      id: o.order_number || `ORD-${o.id}`,
      dbId: o.id, // Keep the numeric ID for requests
      customerName: typeof o.delivery_address === "string" 
        ? o.delivery_address.split(",")[0] 
        : o.delivery_address?.full_name || o.user_username || "Customer",
      customerEmail: o.user_email || "customer@example.com",
      date: o.created_at || new Date().toISOString(),
      total: Number(o.total_amount),
      paymentMethod: o.payment_method_display || o.payment_method || "COD",
      status: o.status_display || o.status,
      couponCode: o.coupon_code || "",
      paymentStatus: o.payment_status_display || o.payment_status || "Pending",
      itemCount: o.item_count || 0
    }));

    return {
      data: mapped,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  },

  // Get details of a single order (takes the display ID or resolves database ID)
  getOrderById: async (displayId) => {
    // Check if displayId is ORD-XXXX format
    let id = displayId;
    if (typeof displayId === "string" && displayId.startsWith("ORD-")) {
      // Find order in list first to get DB ID, or pass directly
      try {
        const listRes = await api.get("/admin/orders/", { params: { search: displayId } });
        const match = listRes.data.results?.find(o => o.order_number === displayId);
        if (match) {
          id = match.id;
        }
      } catch {
        // ignore fallback
      }
    }

    const response = await api.get(`/admin/orders/${id}/`);
    const o = response.data.order || response.data;

    // Build timeline logs based on status
    const timeline = [
      { status: "Order Created", timestamp: o.created_at || new Date().toISOString(), description: "Order placed successfully." }
    ];
    if (o.coupon_code) {
      timeline.push({
        status: "Coupon Applied",
        timestamp: o.created_at || new Date().toISOString(),
        description: `Coupon code '${o.coupon_code}' applied at checkout.`
      });
    }
    if (String(o.payment_status).toLowerCase() === "paid") {
      timeline.push({
        status: "Payment Completed",
        timestamp: o.updated_at || new Date().toISOString(),
        description: "Payment captured successfully."
      });
    }
    const statusLower = String(o.status).toLowerCase();
    if (["confirmed", "packed", "shipped", "delivered"].includes(statusLower)) {
      timeline.push({
        status: "Order Confirmed",
        timestamp: o.updated_at || new Date().toISOString(),
        description: "Order confirmed by administration."
      });
    }
    if (["packed", "shipped", "delivered"].includes(statusLower)) {
      timeline.push({
        status: "Packed",
        timestamp: o.updated_at || new Date().toISOString(),
        description: "Items packed and ready for dispatch."
      });
    }
    if (["shipped", "delivered"].includes(statusLower)) {
      timeline.push({
        status: "Shipped",
        timestamp: o.updated_at || new Date().toISOString(),
        description: "Order handed over to courier partner."
      });
    }
    if (statusLower === "delivered") {
      timeline.push({
        status: "Delivered",
        timestamp: o.updated_at || new Date().toISOString(),
        description: "Order delivered to recipient address."
      });
    } else if (statusLower === "cancelled") {
      timeline.push({
        status: "Cancelled",
        timestamp: o.updated_at || new Date().toISOString(),
        description: "Order was cancelled."
      });
    } else if (statusLower === "refunded") {
      timeline.push({
        status: "Refunded",
        timestamp: o.updated_at || new Date().toISOString(),
        description: "Order was cancelled and amount refunded."
      });
    }

    const formatted = {
      id: o.order_number || `ORD-${o.id}`,
      dbId: o.id,
      customerName: o.delivery_address?.full_name || "Customer",
      customerEmail: o.user_email || "customer@example.com",
      customerPhone: o.delivery_address?.phone || "",
      date: o.created_at || new Date().toISOString(),
      total: Number(o.total_amount),
      paymentMethod: o.payment_method_display || o.payment_method || "COD",
      paymentStatus: o.payment_status_display || o.payment_status || "Pending",
      status: o.status_display || o.status,
      subtotal: Number(o.subtotal),
      shippingCharge: Number(o.shipping_charge),
      discountAmount: Number(o.discount),
      tax: Number(o.tax),
      couponCode: o.coupon_code || "",
      coupon: o.coupon || null,
      shippingAddress: {
        name: o.delivery_address?.full_name || "Customer",
        phone: o.delivery_address?.phone || "",
        addressLine1: o.delivery_address?.address_line_1 || "",
        addressLine2: o.delivery_address?.address_line_2 || "",
        city: o.delivery_address?.city || "",
        state: o.delivery_address?.state || "",
        zipCode: o.delivery_address?.postal_code || "",
        country: o.delivery_address?.country || "India"
      },
      items: (o.items || []).map((item) => ({
        id: item.id,
        name: item.product_name,
        variant: item.variant_name || "Standard",
        sku: item.sku || "",
        price: Number(item.price),
        quantity: item.quantity
      })),
      timeline
    };

    return { data: formatted };
  },

  // Update order status
  updateOrderStatus: async (displayId, newStatus) => {
    let id = displayId;
    if (typeof displayId === "string" && displayId.startsWith("ORD-")) {
      try {
        const listRes = await api.get("/admin/orders/", { params: { search: displayId } });
        const match = listRes.data.results?.find(o => o.order_number === displayId);
        if (match) id = match.id;
      } catch {
        // ignore
      }
    }

    // Call update status PATCH endpoint
    const response = await api.patch(`/admin/orders/${id}/status/`, {
      status: newStatus.toLowerCase()
    });
    
    // Resolve order details to refresh state
    return orderService.getOrderById(id);
  }
};

export default orderService;
