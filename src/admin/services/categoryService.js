import api from "../../api/axios";

// Helper to initialize local storage database for categories
const MOCK_CATEGORIES_KEY = "shopease_mock_categories";
const MOCK_IMAGES_KEY = "shopease_mock_category_images";

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

const getMockCategoryImages = () => {
  const saved = localStorage.getItem(MOCK_IMAGES_KEY);
  if (saved) return JSON.parse(saved);

  // Default seed category images
  const initial = [
    { id: 1, image: "/images/categories/mobile.png", alt_text: "Mobiles Showcase", category: 1 },
    { id: 2, image: "/images/categories/laptop.png", alt_text: "Laptops Showcase", category: 2 },
    { id: 3, image: "/images/categories/accessories.png", alt_text: "Accessories Showcase", category: 3 },
    { id: 4, image: "/images/categories/fashion.png", alt_text: "Fashion Showcase", category: 4 },
    { id: 5, image: "/images/categories/shoes.png", alt_text: "Shoes Showcase", category: 5 }
  ];
  localStorage.setItem(MOCK_IMAGES_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockCategoryImages = (images) => {
  localStorage.setItem(MOCK_IMAGES_KEY, JSON.stringify(images));
};

const categoryService = {
  // ============================================
  // Category Metadata CRUD
  // ============================================
  getCategories: async () => {
    try {
      const response = await api.get("/products/categories/");
      
      if (Array.isArray(response.data)) {
        return response.data.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || "",
          status: cat.is_active !== false ? "Active" : "Inactive",
          count: cat.count || (cat.products ? cat.products.length : 0),
          images: cat.images || []
        }));
      }
      
      const list = response.data?.results || response.data?.categories;
      if (Array.isArray(list)) {
        return list.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || "",
          status: cat.is_active !== false ? "Active" : "Inactive",
          count: cat.count || (cat.products ? cat.products.length : 0),
          images: cat.images || []
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
        description: categoryData.description || "",
        is_active: categoryData.status === "Active"
      });
      return {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description || "",
        status: response.data.is_active !== false ? "Active" : "Inactive",
        count: 0,
        images: []
      };
    } catch (err) {
      console.warn("Backend create category failed, using mock database:", err);
      const categories = getMockCategories();
      const newCategory = {
        id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name: categoryData.name,
        description: categoryData.description || "",
        status: categoryData.status || "Active",
        count: 0,
        images: []
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
        description: categoryData.description || "",
        is_active: categoryData.status === "Active"
      });
      return {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description || "",
        status: response.data.is_active !== false ? "Active" : "Inactive",
        count: response.data.count || 0,
        images: response.data.images || []
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
      throw new Error("Category not found", { cause: err });
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
  },

  // ============================================
  // Category Image CRUD
  // ============================================
  getCategoryImages: async () => {
    try {
      const response = await api.get("/products/categories/images/");
      return response.data;
    } catch (err) {
      console.warn("Backend category images unavailable, using mock database:", err);
      return getMockCategoryImages();
    }
  },

  createCategoryImage: async (formData) => {
    try {
      const response = await api.post("/products/categories/images/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data;
    } catch (err) {
      console.warn("Backend create category image failed, using mock database:", err);
      const images = getMockCategoryImages();
      const file = formData.get("image");
      const categoryId = parseInt(formData.get("category"), 10);
      const altText = formData.get("alt_text") || "";
      
      const newImage = {
        id: images.length ? Math.max(...images.map(i => i.id)) + 1 : 1,
        image: file ? URL.createObjectURL(file) : "/images/categories/default.png",
        alt_text: altText,
        category: categoryId
      };
      images.push(newImage);
      saveMockCategoryImages(images);
      return newImage;
    }
  },

  updateCategoryImage: async (id, formData) => {
    try {
      const response = await api.patch(`/products/categories/images/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data;
    } catch (err) {
      console.warn("Backend update category image failed, using mock database:", err);
      const images = getMockCategoryImages();
      const idx = images.findIndex(i => i.id === id);
      if (idx !== -1) {
        const file = formData.get("image");
        const categoryId = formData.get("category");
        const altText = formData.get("alt_text");

        images[idx] = {
          ...images[idx],
          category: categoryId ? parseInt(categoryId, 10) : images[idx].category,
          alt_text: altText !== null ? altText : images[idx].alt_text
        };
        if (file) {
          images[idx].image = URL.createObjectURL(file);
        }
        saveMockCategoryImages(images);
        return images[idx];
      }
      throw new Error("Category image not found", { cause: err });
    }
  },

  deleteCategoryImage: async (id) => {
    try {
      await api.delete(`/products/categories/images/${id}/`);
      return true;
    } catch (err) {
      console.warn("Backend delete category image failed, using mock database:", err);
      let images = getMockCategoryImages();
      images = images.filter(i => i.id !== id);
      saveMockCategoryImages(images);
      return true;
    }
  }
};

export default categoryService;
