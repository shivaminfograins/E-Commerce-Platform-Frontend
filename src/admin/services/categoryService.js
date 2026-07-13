import api from "../../api/axios";

// Helper to initialize local storage database for categories
const MOCK_CATEGORIES_KEY = "shopease_mock_categories";

const getMockCategories = () => {
  const saved = localStorage.getItem(MOCK_CATEGORIES_KEY);
  if (saved) return JSON.parse(saved);

  // Default seed categories
  const initial = [
    { id: 1, name: "Mobiles", description: "Smartphones and related accessories", status: "Active", count: 24 },
    { id: 2, name: "Laptops", description: "Personal and enterprise portable computers", status: "Active", count: 18 },
    { id: 3, name: "Accessories", description: "Keyboards, chargers, cables, and mice", status: "Active", count: 45 },
    { id: 4, name: "Fashion", description: "Trendy menswear, womenswear, and apparel", status: "Active", count: 32 },
    { id: 5, name: "Shoes", description: "Sports sneakers, formal wear, and boots", status: "Inactive", count: 0 }
  ];
  localStorage.setItem(MOCK_CATEGORIES_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockCategories = (categories) => {
  localStorage.setItem(MOCK_CATEGORIES_KEY, JSON.stringify(categories));
};

const categoryService = {
  getCategories: async () => {
    try {
      // Use actual backend endpoint "/products/categories/"
      const response = await api.get("/products/categories/");
      
      // Ensure the returned data is an array
      if (Array.isArray(response.data)) {
        // Map backend category format if needed
        return response.data.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || "",
          status: cat.status || "Active",
          count: cat.count || 0
        }));
      }
      
      const list = response.data?.results || response.data?.categories;
      if (Array.isArray(list)) {
        return list.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || "",
          status: cat.status || "Active",
          count: cat.count || 0
        }));
      }
      
      throw new Error("Invalid response format");
    } catch (err) {
      console.warn("Backend categories unavailable, falling back to mock database:", err);
      return getMockCategories();
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post("/products/categories/", {
        name: categoryData.name,
        description: categoryData.description || ""
      });
      return {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description || "",
        status: response.data.status || "Active",
        count: 0
      };
    } catch (err) {
      console.warn("Backend create category failed, using mock database:", err);
      const categories = getMockCategories();
      const newCategory = {
        id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name: categoryData.name,
        description: categoryData.description || "",
        status: categoryData.status || "Active",
        count: 0
      };
      categories.push(newCategory);
      saveMockCategories(categories);
      return newCategory;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/products/categories/${id}/`, {
        name: categoryData.name,
        description: categoryData.description || ""
      });
      return {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description || "",
        status: response.data.status || "Active",
        count: response.data.count || 0
      };
    } catch (err) {
      console.warn("Backend update category failed, using mock database:", err);
      const categories = getMockCategories();
      const idx = categories.findIndex(c => c.id === id);
      if (idx !== -1) {
        categories[idx] = {
          ...categories[idx],
          name: categoryData.name,
          description: categoryData.description || "",
          status: categoryData.status || "Active"
        };
        saveMockCategories(categories);
        return categories[idx];
      }
      throw new Error("Category not found");
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.delete(`/products/categories/${id}/`);
      return true;
    } catch (err) {
      console.warn("Backend delete category failed, using mock database:", err);
      let categories = getMockCategories();
      categories = categories.filter(c => c.id !== id);
      saveMockCategories(categories);
      return true;
    }
  }
};

export default categoryService;
