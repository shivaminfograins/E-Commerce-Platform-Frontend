const sleep = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const dummySummaryMetrics = {
  sales: { value: "3,845", change: "+12.5% this month", detail: "Total products sold" },
  revenue: { value: "₹8,45,200", change: "+18.2% vs last month", detail: "Gross store revenue" },
  orders: { value: "1,294", change: "+8.3% this month", detail: "Successfully placed checkouts" },
  customers: { value: "2,840", change: "+15.6% signup growth", detail: "Registered user profiles" },
  products: { value: "186", change: "+14 new items added", detail: "Active online listings" }
};

const dummyRevenueData = [
  { month: "Jan", revenue: 54000 },
  { month: "Feb", revenue: 68000 },
  { month: "Mar", revenue: 62000 },
  { month: "Apr", revenue: 89000 },
  { month: "May", revenue: 95000 },
  { month: "Jun", revenue: 110000 },
  { month: "Jul", revenue: 125000 },
  { month: "Aug", revenue: 118000 },
  { month: "Sep", revenue: 135000 },
  { month: "Oct", revenue: 142000 },
  { month: "Nov", revenue: 165000 },
  { month: "Dec", revenue: 189000 }
];

const dummySalesData = [
  { month: "Jan", orders: 150 },
  { month: "Feb", orders: 190 },
  { month: "Mar", orders: 175 },
  { month: "Apr", orders: 240 },
  { month: "May", orders: 250 },
  { month: "Jun", orders: 290 },
  { month: "Jul", orders: 310 },
  { month: "Aug", orders: 280 },
  { month: "Sep", orders: 340 },
  { month: "Oct", orders: 360 },
  { month: "Nov", orders: 410 },
  { month: "Dec", orders: 480 }
];

const dummyTopProducts = [
  { id: 1, name: "Pro Gaming Laptop v2", category: "Laptops", sales: 120, revenue: 22680000 },
  { id: 2, name: "Noise Cancelling Headphones", category: "Accessories", sales: 98, revenue: 2939020 },
  { id: 3, name: "Smart Fitness Watch Ultra", category: "Accessories", sales: 86, revenue: 7731400 },
  { id: 4, name: "Mechanical Gaming Keyboard", category: "Accessories", sales: 74, revenue: 1110000 },
  { id: 5, name: "Wireless Charging Dock", category: "Accessories", sales: 52, revenue: 156000 }
];

const dummyTopCategories = [
  { name: "Laptops", value: 45 },
  { name: "Accessories", value: 30 },
  { name: "Audio", value: 15 },
  { name: "Wearables", value: 10 }
];

const reportService = {
  getSummaryMetrics: async () => {
    await sleep();
    return { data: dummySummaryMetrics };
  },
  
  getRevenueData: async () => {
    await sleep();
    return { data: dummyRevenueData };
  },

  getSalesData: async () => {
    await sleep();
    return { data: dummySalesData };
  },

  getTopProducts: async () => {
    await sleep();
    return { data: dummyTopProducts };
  },

  getTopCategories: async () => {
    await sleep();
    return { data: dummyTopCategories };
  }
};

export default reportService;
