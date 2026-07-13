// Dummy Customer Data Store
let mockCustomers = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 019-2834",
    status: "Active",
    dateJoined: "2025-01-15",
    avatar: "",
    source: "Web Registration",
    notes: "VIP Customer. Prefers express shipping.",
    lifetimeValue: 1250.50,
    totalOrders: 5,
    addresses: [
      {
        id: 101,
        type: "Shipping",
        isDefault: true,
        name: "Jane Doe",
        phone: "+1 (555) 019-2834",
        addressLine1: "123 Main Street",
        addressLine2: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      {
        id: 102,
        type: "Billing",
        isDefault: true,
        name: "Jane Doe",
        phone: "+1 (555) 019-2834",
        addressLine1: "123 Main Street",
        addressLine2: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      }
    ],
    orders: [
      {
        id: "ORD-99218",
        date: "2026-07-01",
        total: 250.00,
        itemsCount: 3,
        status: "Delivered",
        paymentStatus: "Paid"
      },
      {
        id: "ORD-98104",
        date: "2026-05-14",
        total: 450.50,
        itemsCount: 2,
        status: "Delivered",
        paymentStatus: "Paid"
      },
      {
        id: "ORD-97500",
        date: "2026-03-22",
        total: 550.00,
        itemsCount: 5,
        status: "Delivered",
        paymentStatus: "Paid"
      }
    ]
  },
  {
    id: 2,
    name: "Alex Smith",
    email: "alex.smith@example.com",
    phone: "+1 (555) 482-1920",
    status: "Active",
    dateJoined: "2025-03-22",
    avatar: "",
    source: "Google OAuth",
    notes: "Frequently returns shoes. Standard sizing is US 10.",
    lifetimeValue: 340.00,
    totalOrders: 2,
    addresses: [
      {
        id: 201,
        type: "Shipping",
        isDefault: true,
        name: "Alex Smith",
        phone: "+1 (555) 482-1920",
        addressLine1: "742 Evergreen Terrace",
        addressLine2: "",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        country: "USA"
      }
    ],
    orders: [
      {
        id: "ORD-99102",
        date: "2026-06-25",
        total: 120.00,
        itemsCount: 1,
        status: "Shipped",
        paymentStatus: "Paid"
      },
      {
        id: "ORD-96541",
        date: "2025-11-02",
        total: 220.00,
        itemsCount: 2,
        status: "Delivered",
        paymentStatus: "Paid"
      }
    ]
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 839-4051",
    status: "Inactive",
    dateJoined: "2024-11-05",
    avatar: "",
    source: "Web Registration",
    notes: "Requested account suspension due to inactivity.",
    lifetimeValue: 0.00,
    totalOrders: 0,
    addresses: [],
    orders: []
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 293-8472",
    status: "Active",
    dateJoined: "2025-06-01",
    avatar: "",
    source: "Apple ID",
    notes: "",
    lifetimeValue: 95.00,
    totalOrders: 1,
    addresses: [
      {
        id: 401,
        type: "Shipping",
        isDefault: true,
        name: "Emily Davis",
        phone: "+1 (555) 293-8472",
        addressLine1: "1098 West Coast Hwy",
        addressLine2: "Suite 100",
        city: "Newport Beach",
        state: "CA",
        zipCode: "92660",
        country: "USA"
      }
    ],
    orders: [
      {
        id: "ORD-99450",
        date: "2026-07-10",
        total: 95.00,
        itemsCount: 1,
        status: "Processing",
        paymentStatus: "Paid"
      }
    ]
  },
  {
    id: 5,
    name: "William Wilson",
    email: "will.wilson@example.com",
    phone: "+1 (555) 902-1823",
    status: "Active",
    dateJoined: "2025-08-12",
    avatar: "",
    source: "Web Registration",
    notes: "",
    lifetimeValue: 1200.00,
    totalOrders: 4,
    addresses: [
      {
        id: 501,
        type: "Shipping",
        isDefault: true,
        name: "William Wilson",
        phone: "+1 (555) 902-1823",
        addressLine1: "456 Oak Avenue",
        addressLine2: "",
        city: "Portland",
        state: "OR",
        zipCode: "97201",
        country: "USA"
      }
    ],
    orders: [
      {
        id: "ORD-99380",
        date: "2026-07-08",
        total: 300.00,
        itemsCount: 2,
        status: "Processing",
        paymentStatus: "Paid"
      },
      {
        id: "ORD-98920",
        date: "2026-06-11",
        total: 400.00,
        itemsCount: 3,
        status: "Delivered",
        paymentStatus: "Paid"
      }
    ]
  },
  {
    id: 6,
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    phone: "+1 (555) 304-9582",
    status: "Active",
    dateJoined: "2025-09-18",
    avatar: "",
    source: "Google OAuth",
    notes: "Requires signature on delivery.",
    lifetimeValue: 180.20,
    totalOrders: 1,
    addresses: [
      {
        id: 601,
        type: "Shipping",
        isDefault: true,
        name: "Sophia Martinez",
        phone: "+1 (555) 304-9582",
        addressLine1: "789 Pine Road",
        addressLine2: "",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        country: "USA"
      }
    ],
    orders: [
      {
        id: "ORD-98211",
        date: "2026-05-20",
        total: 180.20,
        itemsCount: 2,
        status: "Delivered",
        paymentStatus: "Paid"
      }
    ]
  },
  {
    id: 7,
    name: "James Taylor",
    email: "james.t@example.com",
    phone: "+1 (555) 712-4029",
    status: "Inactive",
    dateJoined: "2025-10-05",
    avatar: "",
    source: "Web Registration",
    notes: "",
    lifetimeValue: 50.00,
    totalOrders: 1,
    addresses: [
      {
        id: 701,
        type: "Shipping",
        isDefault: true,
        name: "James Taylor",
        phone: "+1 (555) 712-4029",
        addressLine1: "321 Cedar Blvd",
        addressLine2: "",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        country: "USA"
      }
    ],
    orders: [
      {
        id: "ORD-98005",
        date: "2026-04-12",
        total: 50.00,
        itemsCount: 1,
        status: "Cancelled",
        paymentStatus: "Refunded"
      }
    ]
  }
];

const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const customerService = {
  // Get all customers (with search, filter, pagination)
  getCustomers: async (params = {}) => {
    await sleep();
    const { search = "", status = "All", page = 1, limit = 5 } = params;

    let filtered = [...mockCustomers];

    // Apply Search
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          (c.phone && c.phone.toLowerCase().includes(query))
      );
    }

    // Apply Status Filter
    if (status !== "All") {
      filtered = filtered.filter((c) => c.status === status);
    }

    // Pagination Calculations
    const totalCount = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  },

  // Get single customer details by ID
  getCustomerById: async (id) => {
    await sleep();
    const customer = mockCustomers.find((c) => c.id === Number(id));
    if (!customer) {
      throw new Error("Customer not found");
    }
    return { data: customer };
  },

  // Update customer active/inactive status
  updateCustomerStatus: async (id, status) => {
    await sleep(200);
    const index = mockCustomers.findIndex((c) => c.id === Number(id));
    if (index === -1) {
      throw new Error("Customer not found");
    }
    mockCustomers[index] = { ...mockCustomers[index], status };
    return { data: mockCustomers[index] };
  }
};

export default customerService;
