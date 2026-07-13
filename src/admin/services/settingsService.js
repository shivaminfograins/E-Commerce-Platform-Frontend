const SETTINGS_STORAGE_KEY = "shopease_admin_settings";

const getMockSettings = () => {
  const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  const initial = {
    language: "en",
    notificationsEnabled: true,
    emailAlerts: true,
    timezone: "UTC+5:30"
  };
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockSettings = (settings) => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

const sleep = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const settingsService = {
  getSettings: async () => {
    await sleep();
    return { data: getMockSettings() };
  },

  updateSettings: async (data) => {
    await sleep();
    const settings = getMockSettings();
    const updated = { ...settings, ...data };
    saveMockSettings(updated);
    return { data: updated };
  },

  changePassword: async (oldPassword, newPassword) => {
    await sleep(300);
    // Mimics password change endpoint
    if (oldPassword === "admin123") {
      return { success: true, message: "Password updated successfully." };
    }
    throw new Error("Incorrect current password.");
  }
};

export default settingsService;
export { getMockSettings };
