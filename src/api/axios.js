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


// Keep track of refreshing state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercept responses to handle token expiration (401) and attempt refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const url = originalRequest?.url || "";

    // If 401 and not already retried and not a token refresh request itself
    if (status === 401 && !originalRequest._retry && !url.includes("token/refresh")) {
      originalRequest._retry = true;

      const isAdminRoute = url.startsWith("/admin/") || url.includes("/admin/");
      const storageKey = isAdminRoute ? "shopease_admin_user" : "shopease_user";
      const storedUser = localStorage.getItem(storageKey);

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const refreshToken = parsed?.refreshToken || parsed?.user?.refreshToken;

          if (refreshToken) {
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            // Make a direct axios request to avoid interceptors loop
            const refreshUrl = (import.meta.env.VITE_API_BASE_URL || "/api") + "/auth/token/refresh/";
            const refreshRes = await axios.post(refreshUrl, { refresh: refreshToken });

            const newAccessToken = refreshRes.data.access;

            // Update stored tokens
            parsed.accessToken = newAccessToken;
            parsed.token = newAccessToken;
            if (parsed.user) {
              parsed.user.accessToken = newAccessToken;
              parsed.user.token = newAccessToken;
            }
            localStorage.setItem(storageKey, JSON.stringify(parsed));

            isRefreshing = false;
            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null);
          console.warn("Auth token invalid or expired — clearing local session for key:", storageKey);
          localStorage.removeItem(storageKey);
        }
      } else {
        localStorage.removeItem(storageKey);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
