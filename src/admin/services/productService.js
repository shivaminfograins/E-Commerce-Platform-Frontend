import api from "../../api/axios";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

const MOCK_PRODUCTS_KEY = "shopease_mock_products";
const MOCK_VARIANTS_KEY = "shopease_mock_product_variants";
const MOCK_IMAGES_KEY = "shopease_mock_product_images";

const getMockProducts = () => {
  const saved = localStorage.getItem(MOCK_PRODUCTS_KEY);
  if (saved) return JSON.parse(saved);

  const initial = [
    { id: 1, name: "Pro Gaming Laptop v2", brand: "Razer", description: "High-performance gaming laptop with RTX 4080", category: "Laptops", categoryId: 2, status: "Active" },
    { id: 2, name: "Noise Cancelling Headphones", brand: "Sony", description: "Industry-leading wireless active noise cancelling headphones", category: "Accessories", categoryId: 3, status: "Active" },
    { id: 3, name: "Smart Fitness Watch Ultra", brand: "Apple", description: "Track your health metrics with a bright always-on retina display", category: "Accessories", categoryId: 3, status: "Active" }
  ];
  localStorage.setItem(MOCK_PRODUCTS_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockProducts = (products) => {
  localStorage.setItem(MOCK_PRODUCTS_KEY, JSON.stringify(products));
};

const getMockProductVariants = () => {
  const saved = localStorage.getItem(MOCK_VARIANTS_KEY);
  if (saved) return JSON.parse(saved);

  const initial = [
    { id: 1, product: 1, name: "16GB RAM / 1TB SSD", sku: "LP-RZ-16-1T", price: 189000, stock: 15, status: "Active" },
    { id: 2, product: 1, name: "32GB RAM / 2TB SSD", sku: "LP-RZ-32-2T", price: 229000, stock: 8, status: "Active" },
    { id: 3, product: 2, name: "Matte Black", sku: "HD-SY-BLK", price: 29990, stock: 45, status: "Active" },
    { id: 4, product: 2, name: "Platinum Silver", sku: "HD-SY-SLV", price: 29990, stock: 30, status: "Active" },
    { id: 5, product: 3, name: "Ocean Band", sku: "WT-AP-OCN", price: 89900, stock: 20, status: "Active" }
  ];
  localStorage.setItem(MOCK_VARIANTS_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockProductVariants = (variants) => {
  localStorage.setItem(MOCK_VARIANTS_KEY, JSON.stringify(variants));
};

const getMockProductImages = () => {
  const saved = localStorage.getItem(MOCK_IMAGES_KEY);
  if (saved) return JSON.parse(saved);

  const initial = [
    { id: 1, product: 1, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80", alt_text: "Pro Gaming Laptop v2 Showcase" },
    { id: 2, product: 2, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80", alt_text: "Noise Cancelling Headphones Showcase" },
    { id: 3, product: 3, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80", alt_text: "Smart Fitness Watch Ultra Showcase" }
  ];
  localStorage.setItem(MOCK_IMAGES_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockProductImages = (images) => {
  localStorage.setItem(MOCK_IMAGES_KEY, JSON.stringify(images));
};

const productService = {
  // ============================================
  // Product Metadata CRUD
  // ============================================
  getProducts: async () => {
    try {
      const response = await api.get("/products/?page_size=100");
      const data = response.data;
      const list = Array.isArray(data) ? data : (data.results || data.products || []);
      
      return list.map(prod => ({
        id: prod.id,
        name: prod.name,
        brand: prod.brand || null,
        description: prod.description || "",
        categoryId: prod.category,
        category: prod.category_name || `Category (ID: ${prod.category})`,
        status: prod.is_active !== false ? "Active" : "Inactive"
      }));
    } catch (err) {
      console.warn("Backend products unavailable, using mock:", err);
      return getMockProducts();
    }
  },

  createProduct: async (productData) => {
    try {
      const slug = slugify(productData.name);
      const response = await api.post("/products/", {
        name: productData.name,
        slug: slug,
        brand: productData.brand || null,
        description: productData.description || "",
        category: productData.categoryId,
        is_active: productData.status === "Active"
      });
      return {
        id: response.data.id,
        name: response.data.name,
        brand: response.data.brand || null,
        description: response.data.description || "",
        categoryId: response.data.category,
        category: response.data.category_name || `Category (ID: ${response.data.category})`,
        status: response.data.is_active !== false ? "Active" : "Inactive"
      };
    } catch (err) {
      console.warn("Backend create product failed, using mock:", err);
      const products = getMockProducts();
      const newProduct = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: productData.name,
        brand: productData.brand || null,
        description: productData.description || "",
        categoryId: productData.categoryId,
        category: productData.category || "General",
        status: productData.status || "Active"
      };
      products.push(newProduct);
      saveMockProducts(products);
      return newProduct;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const slug = slugify(productData.name);
      const response = await api.put(`/products/${id}/`, {
        name: productData.name,
        slug: slug,
        brand: productData.brand || null,
        description: productData.description || "",
        category: productData.categoryId,
        is_active: productData.status === "Active"
      });
      return {
        id: response.data.id,
        name: response.data.name,
        brand: response.data.brand || null,
        description: response.data.description || "",
        categoryId: response.data.category,
        category: response.data.category_name || `Category (ID: ${response.data.category})`,
        status: response.data.is_active !== false ? "Active" : "Inactive"
      };
    } catch (err) {
      console.warn("Backend update product failed, using mock:", err);
      const products = getMockProducts();
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          name: productData.name,
          brand: productData.brand || null,
          description: productData.description || "",
          categoryId: productData.categoryId,
          category: productData.category || "General",
          status: productData.status || "Active"
        };
        saveMockProducts(products);
        return products[idx];
      }
      throw new Error("Product not found", { cause: err });
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}/`);
      return true;
    } catch (err) {
      console.warn("Backend delete product failed, using mock:", err);
      let products = getMockProducts();
      products = products.filter(p => p.id !== id);
      saveMockProducts(products);
      return true;
    }
  },

  // ============================================
  // Product Variant CRUD
  // ============================================
  getProductVariants: async () => {
    try {
      const response = await api.get("/products/variants/");
      const data = response.data;
      const list = Array.isArray(data) ? data : (data.results || data.variants || []);
      return list.map(v => ({
        id: v.id,
        product: v.product,
        name: v.name,
        sku: v.sku,
        price: parseFloat(v.price),
        stock: parseInt(v.stock, 10),
        status: v.is_active !== false ? "Active" : "Inactive"
      }));
    } catch (err) {
      console.warn("Backend variants unavailable, using mock:", err);
      return getMockProductVariants();
    }
  },

  createProductVariant: async (variantData) => {
    try {
      const response = await api.post("/products/variants/", {
        product: variantData.product,
        name: variantData.name,
        sku: variantData.sku,
        price: variantData.price,
        stock: variantData.stock,
        is_active: variantData.status === "Active"
      });
      return {
        id: response.data.id,
        product: response.data.product,
        name: response.data.name,
        sku: response.data.sku,
        price: parseFloat(response.data.price),
        stock: parseInt(response.data.stock, 10),
        status: response.data.is_active !== false ? "Active" : "Inactive"
      };
    } catch (err) {
      console.warn("Backend create variant failed, using mock:", err);
      const variants = getMockProductVariants();
      const newVariant = {
        id: variants.length ? Math.max(...variants.map(v => v.id)) + 1 : 1,
        product: parseInt(variantData.product, 10),
        name: variantData.name,
        sku: variantData.sku,
        price: parseFloat(variantData.price),
        stock: parseInt(variantData.stock, 10),
        status: variantData.status || "Active"
      };
      variants.push(newVariant);
      saveMockProductVariants(variants);
      return newVariant;
    }
  },

  updateProductVariant: async (id, variantData) => {
    try {
      const response = await api.patch(`/products/variants/${id}/`, {
        product: variantData.product,
        name: variantData.name,
        sku: variantData.sku,
        price: variantData.price,
        stock: variantData.stock,
        is_active: variantData.status === "Active"
      });
      return {
        id: response.data.id,
        product: response.data.product,
        name: response.data.name,
        sku: response.data.sku,
        price: parseFloat(response.data.price),
        stock: parseInt(response.data.stock, 10),
        status: response.data.is_active !== false ? "Active" : "Inactive"
      };
    } catch (err) {
      console.warn("Backend update variant failed, using mock:", err);
      const variants = getMockProductVariants();
      const idx = variants.findIndex(v => v.id === id);
      if (idx !== -1) {
        variants[idx] = {
          ...variants[idx],
          product: variantData.product ? parseInt(variantData.product, 10) : variants[idx].product,
          name: variantData.name !== undefined ? variantData.name : variants[idx].name,
          sku: variantData.sku !== undefined ? variantData.sku : variants[idx].sku,
          price: variantData.price !== undefined ? parseFloat(variantData.price) : variants[idx].price,
          stock: variantData.stock !== undefined ? parseInt(variantData.stock, 10) : variants[idx].stock,
          status: variantData.status !== undefined ? variantData.status : variants[idx].status
        };
        saveMockProductVariants(variants);
        return variants[idx];
      }
      throw new Error("Variant not found", { cause: err });
    }
  },

  deleteProductVariant: async (id) => {
    try {
      await api.delete(`/products/variants/${id}//`);
      return true;
    } catch (err) {
      console.warn("Backend delete variant failed, using mock:", err);
      let variants = getMockProductVariants();
      variants = variants.filter(v => v.id !== id);
      saveMockProductVariants(variants);
      return true;
    }
  },

  // ============================================
  // Product Image CRUD
  // ============================================
  getProductImages: async () => {
    try {
      const response = await api.get("/products/images/");
      const data = response.data;
      return Array.isArray(data) ? data : (data.results || data.images || []);
    } catch (err) {
      console.warn("Backend images unavailable, using mock:", err);
      return getMockProductImages();
    }
  },

  createProductImage: async (formData) => {
    try {
      const response = await api.post("/products/images/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data;
    } catch (err) {
      console.warn("Backend create product image failed, using mock:", err);
      const images = getMockProductImages();
      const file = formData.get("image");
      const productId = parseInt(formData.get("product"), 10);
      const altText = formData.get("alt_text") || "";
      
      const newImg = {
        id: images.length ? Math.max(...images.map(i => i.id)) + 1 : 1,
        image: file ? URL.createObjectURL(file) : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80",
        alt_text: altText,
        product: productId
      };
      images.push(newImg);
      saveMockProductImages(images);
      return newImg;
    }
  },

  updateProductImage: async (id, formData) => {
    try {
      const response = await api.patch(`/products/images/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data;
    } catch (err) {
      console.warn("Backend update product image failed, using mock:", err);
      const images = getMockProductImages();
      const idx = images.findIndex(i => i.id === id);
      if (idx !== -1) {
        const file = formData.get("image");
        const productId = formData.get("product");
        const altText = formData.get("alt_text");

        images[idx] = {
          ...images[idx],
          product: productId ? parseInt(productId, 10) : images[idx].product,
          alt_text: altText !== null ? altText : images[idx].alt_text
        };
        if (file) {
          images[idx].image = URL.createObjectURL(file);
        }
        saveMockProductImages(images);
        return images[idx];
      }
      throw new Error("Product image not found", { cause: err });
    }
  },

  deleteProductImage: async (id) => {
    try {
      await api.delete(`/products/images/${id}/`);
      return true;
    } catch (err) {
      console.warn("Backend delete product image failed, using mock:", err);
      let images = getMockProductImages();
      images = images.filter(i => i.id !== id);
      saveMockProductImages(images);
      return true;
    }
  }
};

export default productService;
