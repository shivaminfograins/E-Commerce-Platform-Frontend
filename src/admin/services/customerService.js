import api from "../../api/axios";

const BACKEND_ORIGIN = import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

const normalizeAvatarUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return BACKEND_ORIGIN + url;
  return BACKEND_ORIGIN + "/" + url;
};

const customerService = {
  // Get all customers (with search, filter, pagination)
  getCustomers: async (params = {}) => {
    const { search = "", status = "All", page = 1, limit = 5 } = params;
    const apiParams = { page, page_size: limit };

    if (search.trim()) {
      apiParams.search = search;
    }
    if (status === "Active") {
      apiParams.is_active = "true";
    } else if (status === "Inactive") {
      apiParams.is_active = "false";
    }

    const response = await api.get("/admin/customers/", { params: apiParams });
    const results = response.data.results || response.data || [];
    const count = response.data.count || results.length;

    // Fetch orders count and lifetime values in parallel or calculate
    const mapped = await Promise.all(
      results.map(async (c) => {
        let totalOrders = 0;
        let lifetimeValue = 0;
        try {
          const ordersRes = await api.get(`/admin/customers/${c.id}/orders/`);
          const ordersList = ordersRes.data || [];
          totalOrders = ordersList.length;
          lifetimeValue = ordersList.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        } catch {
          // ignore
        }
        return {
          id: c.id,
          name: c.username || c.email?.split("@")[0] || "User",
          email: c.email,
          phone: c.phone || "",
          status: c.is_active === false ? "Inactive" : "Active",
          dateJoined: c.date_joined || "2025-01-01",
          avatar: normalizeAvatarUrl(c.avatar),
          totalOrders,
          lifetimeValue
        };
      })
    );

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

  // Get single customer details by ID (resolves info, addresses, and orders)
  getCustomerById: async (id) => {
    const [detailsRes, ordersRes, addressesRes] = await Promise.all([
      api.get(`/admin/customers/${id}/`),
      api.get(`/admin/customers/${id}/orders/`),
      api.get(`/admin/customers/${id}/addresses/`)
    ]);

    const c = detailsRes.data;
    const ordersList = ordersRes.data || [];
    const addressesList = addressesRes.data || [];

    const totalOrders = ordersList.length;
    const lifetimeValue = ordersList.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    const formattedCustomer = {
      id: c.id,
      name: c.username || c.email?.split("@")[0] || "User",
      email: c.email,
      phone: c.phone || c.profile_details?.phone || "",
      status: c.is_active === false ? "Inactive" : "Active",
      dateJoined: c.date_joined || "2025-01-01",
      avatar: normalizeAvatarUrl(c.avatar),
      source: c.source || "Web Registration",
      notes: c.notes || "",
      lifetimeValue,
      totalOrders,
      addresses: addressesList.map((addr) => ({
        id: addr.id,
        type: addr.is_default ? "Billing/Shipping" : "Shipping",
        isDefault: addr.is_default || false,
        name: addr.full_name || c.username || "Customer",
        phone: addr.phone || "",
        addressLine1: addr.address_line_1,
        addressLine2: addr.address_line_2 || "",
        city: addr.city,
        state: addr.state,
        zipCode: addr.postal_code,
        country: addr.country || "India"
      })),
      orders: ordersList.map((o) => ({
        id: o.order_number || `ORD-${o.id}`,
        date: o.created_at || "2025-01-01",
        total: Number(o.total_amount),
        itemsCount: o.item_count || 1,
        status: o.status_display || o.status,
        paymentStatus: o.payment_status_display || o.payment_status
      }))
    };

    return { data: formattedCustomer };
  },

  // Update customer active/inactive status
  updateCustomerStatus: async (id, status) => {
    let response;
    if (status === "Inactive") {
      response = await api.patch(`/admin/customers/${id}/block/`);
    } else {
      response = await api.patch(`/admin/customers/${id}/unblock/`);
    }
    return response;
  }
};

export default customerService;
