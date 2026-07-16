import api from "../../api/axios";

const profileService = {
  getProfile: async () => {
    const response = await api.get("/admin/profile/");
    const p = response.data;
    return {
      data: {
        name: p.username || "",
        email: p.email || "",
        phone: p.profile_details?.phone || p.phone || "",
        avatar: p.profile_details?.avatar || p.avatar || "",
        role: p.role || "Super Admin",
        joinedDate: p.created_at || "2025-01-01"
      }
    };
  },

  updateProfile: async (data) => {
    const payload = {
      username: data.name,
      email: data.email,
      phone: data.phone,
      date_of_birth: "1990-01-01" // Default required fallback
    };
    const response = await api.put("/admin/profile/", payload);
    const p = response.data;
    return {
      data: {
        name: p.username || "",
        email: p.email || "",
        phone: p.profile_details?.phone || p.phone || "",
        avatar: p.profile_details?.avatar || p.avatar || "",
        role: p.role || "Super Admin",
        joinedDate: p.created_at || "2025-01-01"
      }
    };
  }
};

export default profileService;
