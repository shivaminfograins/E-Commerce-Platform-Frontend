import api from "../../api/axios";

const MOCK_ORDERS_KEY = "shopease_mock_admin_orders";

const getMockOrders = () => {
  const saved = localStorage.getItem(MOCK_ORDERS_KEY);
  if (saved) return JSON.parse(saved);

  // Default seed orders with detailed item information and timeline logs
  const initial = [
    {
      id: "ORD-99218",
      customerName: "Jane Doe",
      customerEmail: "jane.doe@example.com",
      customerPhone: "+1 (555) 019-2834",
      date: "2026-07-01T10:15:30Z",
      total: 250.00,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      status: "Delivered",
      shippingAddress: {
        name: "Jane Doe",
        phone: "+1 (555) 019-2834",
        addressLine1: "123 Main Street",
        addressLine2: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      items: [
        { id: 1, name: "Noise Cancelling Headphones", variant: "Matte Black", sku: "HD-SY-BLK", price: 100.00, quantity: 2 },
        { id: 2, name: "Wireless Bluetooth Speaker", variant: "Midnight Blue", sku: "SP-AN-BLU", price: 50.00, quantity: 1 }
      ],
      timeline: [
        { status: "Pending", timestamp: "2026-07-01T10:15:30Z", description: "Order placed by customer." },
        { status: "Confirmed", timestamp: "2026-07-01T10:30:00Z", description: "Payment verified and order confirmed." },
        { status: "Packed", timestamp: "2026-07-01T14:00:00Z", description: "Order items packed at warehouse." },
        { status: "Shipped", timestamp: "2026-07-02T09:00:00Z", description: "In transit via FedEx. Tracking ID: FX-19283." },
        { status: "Delivered", timestamp: "2026-07-04T16:22:00Z", description: "Delivered at front door. Signature obtained." }
      ]
    },
    {
      id: "ORD-99380",
      customerName: "William Wilson",
      customerEmail: "will.wilson@example.com",
      customerPhone: "+1 (555) 902-1823",
      date: "2026-07-08T14:45:00Z",
      total: 300.00,
      paymentMethod: "Stripe",
      paymentStatus: "Paid",
      status: "Processing",
      shippingAddress: {
        name: "William Wilson",
        phone: "+1 (555) 902-1823",
        addressLine1: "456 Oak Avenue",
        addressLine2: "",
        city: "Portland",
        state: "OR",
        zipCode: "97201",
        country: "USA"
      },
      items: [
        { id: 3, name: "Smart Fitness Watch Ultra", variant: "Ocean Band", sku: "WT-AP-OCN", price: 150.00, quantity: 2 }
      ],
      timeline: [
        { status: "Pending", timestamp: "2026-07-08T14:45:00Z", description: "Order placed by customer." },
        { status: "Confirmed", timestamp: "2026-07-08T14:50:00Z", description: "Payment verified and order confirmed." }
      ]
    },
    {
      id: "ORD-99450",
      customerName: "Emily Davis",
      customerEmail: "emily.davis@example.com",
      customerPhone: "+1 (555) 293-8472",
      date: "2026-07-10T08:12:00Z",
      total: 95.00,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      status: "Pending",
      shippingAddress: {
        name: "Emily Davis",
        phone: "+1 (555) 293-8472",
        addressLine1: "1098 West Coast Hwy",
        addressLine2: "Suite 100",
        city: "Newport Beach",
        state: "CA",
        zipCode: "92660",
        country: "USA"
      },
      items: [
        { id: 4, name: "Minimalist Leather Wallet", variant: "Tan Brown", sku: "WA-MN-BRN", price: 95.00, quantity: 1 }
      ],
      timeline: [
        { status: "Pending", timestamp: "2026-07-10T08:12:00Z", description: "Order submitted via Cash on Delivery." }
      ]
    },
    {
      id: "ORD-99102",
      customerName: "Alex Smith",
      customerEmail: "alex.smith@example.com",
      customerPhone: "+1 (555) 482-1920",
      date: "2026-06-25T11:20:00Z",
      total: 120.00,
      paymentMethod: "Stripe",
      paymentStatus: "Paid",
      status: "Shipped",
      shippingAddress: {
        name: "Alex Smith",
        phone: "+1 (555) 482-1920",
        addressLine1: "742 Evergreen Terrace",
        addressLine2: "",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        country: "USA"
      },
      items: [
        { id: 5, name: "Ergonomic USB Mouse", variant: "Space Gray", sku: "MS-ER-GRY", price: 60.00, quantity: 2 }
      ],
      timeline: [
        { status: "Pending", timestamp: "2026-06-25T11:20:00Z", description: "Order placed by customer." },
        { status: "Confirmed", timestamp: "2026-06-25T11:35:00Z", description: "Payment approved." },
        { status: "Packed", timestamp: "2026-06-25T16:00:00Z", description: "Packed and prepared for courier dispatch." },
        { status: "Shipped", timestamp: "2026-06-26T10:10:00Z", description: "Carrier picked up shipment." }
      ]
    },
    {
      id: "ORD-98005",
      customerName: "James Taylor",
      customerEmail: "james.t@example.com",
      customerPhone: "+1 (555) 712-4029",
      date: "2026-04-12T16:00:00Z",
      total: 50.00,
      paymentMethod: "UPI",
      paymentStatus: "Refunded",
      status: "Cancelled",
      shippingAddress: {
        name: "James Taylor",
        phone: "+1 (555) 712-4029",
        addressLine1: "321 Cedar Blvd",
        addressLine2: "",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        country: "USA"
      },
      items: [
        { id: 6, name: "Fast Charge USB-C Cable", variant: "1.5m White", sku: "CB-FC-WHT", price: 25.00, quantity: 2 }
      ],
      timeline: [
        { status: "Pending", timestamp: "2026-04-12T16:00:00Z", description: "Order placed." },
        { status: "Cancelled", timestamp: "2026-04-12T17:30:00Z", description: "Cancelled by customer. Payment refunded." }
      ]
    }
  ];
  localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockOrders = (orders) => {
  localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(orders));
};

const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const orderService = {
  // Get all orders (supports search, filter, pagination)
  getOrders: async (params = {}) => {
    await sleep();
    try {
      const response = await api.get("/admin/orders/", { params });
      return response.data;
    } catch {
      // Fallback to local storage mock data
      const { search = "", status = "All", page = 1, limit = 5 } = params;
      let orders = getMockOrders();

      // Apply Search
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        orders = orders.filter(
          (o) =>
            o.id.toLowerCase().includes(query) ||
            o.customerName.toLowerCase().includes(query) ||
            o.customerEmail.toLowerCase().includes(query)
        );
      }

      // Apply Status Filter
      if (status !== "All") {
        orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
      }

      const totalCount = orders.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginated = orders.slice(startIndex, endIndex);

      return {
        data: paginated,
        pagination: {
          total: totalCount,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    }
  },

  // Get details of a single order
  getOrderById: async (id) => {
    await sleep();
    try {
      const response = await api.get(`/admin/orders/${id}/`);
      return response.data;
    } catch {
      const orders = getMockOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) throw new Error("Order not found");
      return { data: order };
    }
  },

  // Update order status
  updateOrderStatus: async (id, newStatus) => {
    await sleep(300);
    try {
      const response = await api.patch(`/admin/orders/${id}/status/`, { status: newStatus });
      return response.data;
    } catch {
      const orders = getMockOrders();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error("Order not found");

      const order = orders[idx];
      
      // Append a timeline log event
      const newEvent = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        description: `Order status manually updated to ${newStatus} by admin.`
      };

      const updatedOrder = {
        ...order,
        status: newStatus,
        timeline: [...order.timeline, newEvent]
      };

      orders[idx] = updatedOrder;
      saveMockOrders(orders);
      return { data: updatedOrder };
    }
  }
};

export default orderService;
export { getMockOrders };
