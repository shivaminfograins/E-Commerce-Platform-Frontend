import api from "../api/axios";

const couponService = {
  // Admin Methods
  getCoupons(params = {}) {
    return api.get("/admin/coupons/", { params });
  },

  createCoupon(data) {
    return api.post("/admin/coupons/", data);
  },

  updateCoupon(id, data) {
    return api.put(`/admin/coupons/${id}/`, data);
  },

  deleteCoupon(id) {
    return api.delete(`/admin/coupons/${id}/`);
  },

  toggleCouponStatus(id) {
    return api.patch(`/admin/coupons/${id}/toggle-status/`);
  },

  // Customer Methods
  validateCoupon(code) {
    return api.post("/coupons/validate/", { code });
  },

  applyCoupon(code) {
    return api.post("/coupons/apply/", { code });
  },
};

export default couponService;
