import api from "../api/axios";

const vendorService = {
  applyVendor: async (formData) => {
    const response = await api.post("/vendors/apply/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getVendorProfile: async () => {
    const response = await api.get("/vendors/profile/");
    return response.data;
  },

  getVendorDashboardData: async () => {
    const response = await api.get("/vendors/dashboard/");
    return response.data;
  },

  updateVendorProfile: async (formData) => {
    const response = await api.patch("/vendors/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  resubmitVendor: async () => {
    const response = await api.post("/vendors/profile/resubmit/");
    return response.data;
  },

  // Admin APIs
  getAdminVendors: async (params = {}) => {
    const response = await api.get("/admin/vendors/", { params });
    return response.data;
  },

  getAdminVendorDetail: async (id) => {
    const response = await api.get(`/admin/vendors/${id}/`);
    return response.data;
  },

  approveVendor: async (id) => {
    const response = await api.post(`/admin/vendors/${id}/approve/`);
    return response.data;
  },

  rejectVendor: async (id, reason) => {
    const response = await api.post(`/admin/vendors/${id}/reject/`, {
      rejection_reason: reason,
    });
    return response.data;
  },
};

export default vendorService;
