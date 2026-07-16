import api from "../../api/axios";

const settingsService = {
  getSettings: async () => {
    const response = await api.get("/admin/settings/");
    return { data: response.data };
  },

  updateSettings: async (data) => {
    const response = await api.put("/admin/settings/", data);
    return { data: response.data };
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post("/admin/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: newPassword
    });
    return response.data;
  }
};

export default settingsService;
