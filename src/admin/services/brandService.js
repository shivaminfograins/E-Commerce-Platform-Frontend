import api from "../../api/axios";

const MOCK_BRANDS_KEY = "shopease_mock_brands";

const getMockBrands = () => {
  const saved = localStorage.getItem(MOCK_BRANDS_KEY);
  if (saved) return JSON.parse(saved);

  const initial = [
    { id: 1, name: "Razer", slug: "razer", description: "For Gamers. By Gamers.", status: "Active" },
    { id: 2, name: "Sony", slug: "sony", description: "Be Moved. Sound, electronics, and gaming systems.", status: "Active" },
    { id: 3, name: "Apple", slug: "apple", description: "Think Different. Premium smart hardware and systems.", status: "Active" },
    { id: 4, name: "Nike", slug: "nike", description: "Just Do It. Premium sports wear and footwear.", status: "Active" },
    { id: 5, name: "Adidas", slug: "adidas", description: "Impossible is Nothing. Premium sportswear.", status: "Active" }
  ];
  localStorage.setItem(MOCK_BRANDS_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockBrands = (brands) => {
  localStorage.setItem(MOCK_BRANDS_KEY, JSON.stringify(brands));
};

const brandService = {
  getBrands: async () => {
    try {
      const response = await api.get("/products/brands/");
      const data = response.data;
      const list = Array.isArray(data) ? data : (data.results || data.brands || []);
      return list.map((br) => ({
        id: br.id,
        name: br.name,
        slug: br.slug,
        image: br.image || null,
        description: br.description || "",
        status: br.is_active !== false ? "Active" : "Inactive"
      }));
    } catch (err) {
      console.warn("Backend brands unavailable, using mock:", err);
      return getMockBrands();
    }
  },

  createBrand: async (formData) => {
    try {
      const response = await api.post("/products/brands/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return {
        id: response.data.id,
        name: response.data.name,
        slug: response.data.slug,
        image: response.data.image || null,
        description: response.data.description || "",
        status: response.data.is_active !== false ? "Active" : "Inactive"
      };
    } catch (err) {
      console.warn("Backend create brand failed, using mock:", err);
      const brands = getMockBrands();
      const name = formData.get("name");
      const description = formData.get("description") || "";
      const isActive = formData.get("is_active") !== "false";
      const file = formData.get("image");

      const newBrand = {
        id: brands.length ? Math.max(...brands.map((b) => b.id)) + 1 : 1,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        image: file ? URL.createObjectURL(file) : null,
        description,
        status: isActive ? "Active" : "Inactive"
      };
      brands.push(newBrand);
      saveMockBrands(brands);
      return newBrand;
    }
  },

  updateBrand: async (id, formData) => {
    try {
      const response = await api.patch(`/products/brands/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return {
        id: response.data.id,
        name: response.data.name,
        slug: response.data.slug,
        image: response.data.image || null,
        description: response.data.description || "",
        status: response.data.is_active !== false ? "Active" : "Inactive"
      };
    } catch (err) {
      console.warn("Backend update brand failed, using mock:", err);
      const brands = getMockBrands();
      const idx = brands.findIndex((b) => b.id === id);
      if (idx !== -1) {
        const name = formData.get("name");
        const description = formData.get("description");
        const isActive = formData.get("is_active");
        const file = formData.get("image");

        brands[idx] = {
          ...brands[idx],
          name: name !== null && name !== undefined ? name : brands[idx].name,
          slug: name ? name.toLowerCase().replace(/\s+/g, "-") : brands[idx].slug,
          description: description !== null && description !== undefined ? description : brands[idx].description,
          status: isActive !== null && isActive !== undefined ? (isActive === "true" ? "Active" : "Inactive") : brands[idx].status
        };
        if (file) {
          brands[idx].image = URL.createObjectURL(file);
        }
        saveMockBrands(brands);
        return brands[idx];
      }
      throw new Error("Brand not found", { cause: err });
    }
  },

  deleteBrand: async (id) => {
    try {
      await api.delete(`/products/brands/${id}/`);
      return true;
    } catch (err) {
      console.warn("Backend delete brand failed, using mock:", err);
      let brands = getMockBrands();
      brands = brands.filter((b) => b.id !== id);
      saveMockBrands(brands);
      return true;
    }
  }
};

export default brandService;
