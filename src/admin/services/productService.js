import api from "../../api/axios";

const MOCK_PRODUCTS_KEY = "shopease_mock_products";

const getMockProducts = () => {
  const saved = localStorage.getItem(MOCK_PRODUCTS_KEY);
  if (saved) return JSON.parse(saved);

  // Default seed products matching customer frontend expectations
  const initial = [
    {
      id: 1,
      name: "Pro Gaming Laptop v2",
      brand: "Razer",
      description: "High-performance gaming laptop with RTX 4080",
      category: "Laptops",
      categoryId: 2,

      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80",
      status: "Active",
      rating: 4.8,
      reviewsCount: 124,
      badge: "Best Seller",
      variants: [
        { id: 101, name: "16GB RAM / 1TB SSD", sku: "LP-RZ-16-1T", price: 189000, stock: 15 },
        { id: 102, name: "32GB RAM / 2TB SSD", sku: "LP-RZ-32-2T", price: 229000, stock: 8 }
      ]
    },
    {
      id: 2,
      name: "Noise Cancelling Headphones",
      brand: "Sony",
      description: "Industry-leading wireless active noise cancelling headphones",
      category: "Accessories",
      categoryId: 3,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
      status: "Active",
      rating: 4.7,
      reviewsCount: 98,
      badge: "Hot",
      variants: [
        { id: 201, name: "Matte Black", sku: "HD-SY-BLK", price: 29990, stock: 45 },
        { id: 202, name: "Platinum Silver", sku: "HD-SY-SLV", price: 29990, stock: 30 }
      ]
    },
    {
      id: 3,
      name: "Smart Fitness Watch Ultra",
      brand: "Apple",
      description: "Track your health metrics with a bright always-on retina display",
      category: "Accessories",
      categoryId: 3,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
      status: "Active",
      rating: 4.5,
      reviewsCount: 86,
      badge: "",
      variants: [
        { id: 301, name: "Ocean Band", sku: "WT-AP-OCN", price: 89900, stock: 20 }
      ]
    }
  ];
  localStorage.setItem(MOCK_PRODUCTS_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockProducts = (products) => {
  localStorage.setItem(MOCK_PRODUCTS_KEY, JSON.stringify(products));
};

const productService = {
  getProducts: async () => {
    try {
      const response = await api.get("/products/");
      // Try to parse actual API returns
      const data = response.data;
      if (Array.isArray(data)) return data;
      const list = data.results || data.products;
      if (Array.isArray(list)) return list;
      throw new Error("Invalid response format");
    } catch {
      return getMockProducts();
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post("/products/", productData);
      return response.data;
    } catch {
      const products = getMockProducts();
      const newProduct = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: productData.name,
        brand: productData.brand || "",
        description: productData.description || "",
        category: productData.category || "General",
        categoryId: productData.categoryId || 0,
        image: productData.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80",
        status: productData.status || "Active",
        rating: 4.5,
        reviewsCount: 0,
        badge: "",
        variants: productData.variants || []
      };
      products.push(newProduct);
      saveMockProducts(products);
      return newProduct;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}/`, productData);
      return response.data;
    } catch {
      const products = getMockProducts();
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          name: productData.name,
          brand: productData.brand || "",
          description: productData.description || "",
          category: productData.category || "General",
          categoryId: productData.categoryId || 0,
          image: productData.image || products[idx].image,
          status: productData.status || "Active",
          variants: productData.variants || []
        };
        saveMockProducts(products);
        return products[idx];
      }
      throw new Error("Product not found");
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}/`);
      return true;
    } catch {
      let products = getMockProducts();
      products = products.filter(p => p.id !== id);
      saveMockProducts(products);
      return true;
    }
  }
};

export default productService;
export { getMockProducts };
