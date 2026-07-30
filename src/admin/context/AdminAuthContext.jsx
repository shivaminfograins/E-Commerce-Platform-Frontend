import React, { createContext, useState, useEffect, useContext } from "react";
import adminAuthService from "../services/adminAuthService";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminUser?.token) {
      localStorage.setItem("shopease_admin_user", JSON.stringify(adminUser));
    } else {
      localStorage.removeItem("shopease_admin_user");
    }
  }, [adminUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await adminAuthService.login({ email, password });
      const user = data.user;
      
      // Verify role
      if (!adminAuthService.verifyAdminRole(user)) {
        throw new Error("Access Denied: You do not have administrator privileges.");
      }
      
      setAdminUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem("shopease_admin_user");
  };

  const updateAdminUser = (updatedData) => {
    setAdminUser((prev) => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem("shopease_admin_user", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, updateAdminUser, setAdminUser, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
