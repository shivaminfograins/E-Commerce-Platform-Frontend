import api from "../api/axios";

const profileService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/auth/profile/");
    return response.data;
  },

  // Update profile (full update)
  updateProfile: async (data) => {
    const response = await api.put("/auth/profile/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Partial update profile
  patchProfile: async (data) => {
    const response = await api.patch("/auth/profile/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default profileService;
