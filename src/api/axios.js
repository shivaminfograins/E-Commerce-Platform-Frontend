import axios from "axios";

const api = axios.create({
  // Use relative /api so requests go through the Vite dev proxy to Django.
  // In production, replace with the absolute backend URL via VITE_API_BASE_URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const url = config.url || "";

    // For admin API routes always prefer the admin token to avoid 403s.
    const isAdminRoute = url.startsWith("/admin/") || url.includes("/admin/");

    let token = null;

    if (isAdminRoute) {
      // Try admin token first, fall back to generic user token
      const adminStored = localStorage.getItem("shopease_admin_user");
      if (adminStored) {
        const parsed = JSON.parse(adminStored);
        token = parsed?.accessToken || parsed?.token;
      }
      if (!token) {
        const userStored = localStorage.getItem("shopease_user");
        if (userStored) {
          const parsed = JSON.parse(userStored);
          token = parsed?.accessToken || parsed?.token;
        }
      }
    } else {
      // For non-admin routes prefer the regular user token, fall back to admin
      const userStored = localStorage.getItem("shopease_user");
      if (userStored) {
        const parsed = JSON.parse(userStored);
        token = parsed?.accessToken || parsed?.token;
      }
      if (!token) {
        const adminStored = localStorage.getItem("shopease_admin_user");
        if (adminStored) {
          const parsed = JSON.parse(adminStored);
          token = parsed?.accessToken || parsed?.token;
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const guestId = localStorage.getItem("guest_id");
    if (guestId) {
      config.headers["X-Guest-ID"] = guestId;
    }
  } catch (error) {
    console.warn("Unable to attach auth token/guest ID:", error);
  }

  return config;
});


// Clear stale auth tokens if the backend rejects them.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    // If a token-refresh call fails, the stored tokens are invalid — clear them.
    if (status === 401 || (status === 500 && url.includes("token/refresh"))) {
      console.warn("Auth token invalid or expired — clearing local session.");
      localStorage.removeItem("shopease_user");
      // Do NOT redirect here; let individual components handle missing user state.
    }
    return Promise.reject(error);
  }
);

export default api;
