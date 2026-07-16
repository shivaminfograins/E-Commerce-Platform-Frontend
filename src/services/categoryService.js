import api from "../api/axios";

const categoryService = {
  getCategories: async () => {
    const response = await api.get("/products/categories/");
    //console.log("Category Service Response:", response.data); // Debugging line
    return response.data;
  },

  getCategoryImages: async () => {
    try {
      const response = await api.get("/products/categories/images/");
      return response.data;
    } catch (err) {
      console.warn("Failed to fetch category images, using defaults/fallback", err);
      return [];
    }
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/products/categories/${id}/`);
    return response.data;
  },
};

export default categoryService;
