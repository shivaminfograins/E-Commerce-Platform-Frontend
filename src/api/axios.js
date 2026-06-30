import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const storedUser = localStorage.getItem("shopease_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const token = parsedUser?.accessToken || parsedUser?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.warn("Unable to attach auth token:", error);
  }

  return config;
});

export default api;
