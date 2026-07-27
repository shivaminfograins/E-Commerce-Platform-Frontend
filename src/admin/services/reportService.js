import api from "../../api/axios";

const reportService = {
  getSummaryMetrics: async (params = {}) => {
    const [sales, rev, ord, cust, prod] = await Promise.all([
      api.get("/admin/reports/sales/", { params }),
      api.get("/admin/reports/revenue/", { params }),
      api.get("/admin/reports/orders/", { params }),
      api.get("/admin/reports/customers/", { params }),
      api.get("/admin/reports/products/")
    ]);

    return {
      data: {
        sales: {
          value: sales.data.value,
          change: sales.data.change,
          detail: sales.data.detail
        },
        revenue: {
          value: rev.data.value,
          change: rev.data.change,
          detail: rev.data.detail
        },
        orders: {
          value: ord.data.value,
          change: ord.data.change,
          detail: ord.data.detail
        },
        customers: {
          value: cust.data.value,
          change: cust.data.change,
          detail: cust.data.detail
        },
        products: {
          value: prod.data.value,
          change: prod.data.change,
          detail: prod.data.detail
        }
      }
    };
  },

  getRevenueData: async (params = {}) => {
    const response = await api.get("/admin/reports/revenue/", { params });
    return { data: response.data.trend || [] };
  },

  getSalesData: async (params = {}) => {
    const response = await api.get("/admin/reports/sales/", { params });
    return { data: response.data.trend || [] };
  },

  getTopProducts: async () => {
    const response = await api.get("/admin/reports/products/");
    const products = response.data.top_products || [];
    return {
      data: products.map((p) => ({
        id: p.product_id,
        name: p.product_name,
        category: p.category || "General",
        sales: p.sales,
        revenue: p.revenue
      }))
    };
  },

  getTopCategories: async () => {
    const response = await api.get("/admin/reports/products/");
    return { data: response.data.category_distribution || [] };
  },
  
  getCouponReports: async () => {
    const response = await api.get("/admin/reports/coupons/");
    return { data: response.data || [] };
  }
};

export default reportService;
