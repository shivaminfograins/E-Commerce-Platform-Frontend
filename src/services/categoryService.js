import api from "../api/axios";

const categoryService = {
  getCategories: async () => {
    const response = await api.get("/products/categories/");
    //console.log("Category Service Response:", response.data); // Debugging line
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/products/categories/${id}/`);
    return response.data;
  },
};

export default categoryService;
