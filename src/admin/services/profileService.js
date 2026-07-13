const PROFILE_STORAGE_KEY = "shopease_admin_profile";

const getMockProfile = () => {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  const initial = {
    name: "Admin User",
    email: "admin@shopease.com",
    phone: "+91 9876543210",
    avatar: "",
    role: "Super Admin",
    joinedDate: "2025-01-01"
  };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockProfile = (profile) => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

const sleep = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const profileService = {
  getProfile: async () => {
    await sleep();
    return { data: getMockProfile() };
  },

  updateProfile: async (data) => {
    await sleep();
    const profile = getMockProfile();
    const updated = { ...profile, ...data };
    saveMockProfile(updated);
    return { data: updated };
  }
};

export default profileService;
export { getMockProfile };
