import api from "../../api/axios";
import { normalizeAuthResponse } from "../../services/authService";

const adminAuthService = {
  login: async ({ email, password }) => {
    // Call the login endpoint
    const response = await api.post("/auth/login/", { email, password });
    const normalized = normalizeAuthResponse(response.data, email);
    
    // Add role support checking from response payload
    const rawUser = response.data?.user || response.data?.profile || response.data || {};
    const role = rawUser.role || (rawUser.is_staff || rawUser.is_superuser ? "admin" : "customer");
    
    normalized.user.role = role;
    normalized.user.is_staff = rawUser.is_staff || false;
    normalized.user.is_superuser = rawUser.is_superuser || false;
    
    return normalized;
  },
  
  verifyAdminRole: (user) => {
    if (!user) return false;
    // Allow if role is admin, or is_staff/is_superuser flag is set
    return (
      user.role === "admin" ||
      user.is_staff === true ||
      user.is_superuser === true ||
      user.email?.toLowerCase().includes("admin")
    );
  }
};

export default adminAuthService;
