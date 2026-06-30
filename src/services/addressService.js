import api from "../api/axios";

const addressService = {
  // Get all addresses for current user
  getAddresses: async () => {
    const response = await api.get("/auth/addresses/");
    return response.data;
  },

  // Create a new address
  createAddress: async (data) => {
    const response = await api.post("/auth/addresses/", data);
    return response.data;
  },

  // Get single address by ID
  getAddress: async (id) => {
    const response = await api.get(`/auth/addresses/${id}/`);
    return response.data;
  },

  // Update address (full update)
  updateAddress: async (id, data) => {
    const response = await api.put(`/auth/addresses/${id}/`, data);
    return response.data;
  },

  // Partial update address
  patchAddress: async (id, data) => {
    const response = await api.patch(`/auth/addresses/${id}/`, data);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id) => {
    const response = await api.delete(`/auth/addresses/${id}/`);
    return response.data;
  },
};

export default addressService;
