import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Categories from "../pages/Categories/Categories";
import Products from "../pages/Products/Products";
import CustomerList from "../pages/Customers/CustomerList";
import CustomerDetailsPage from "../pages/Customers/CustomerDetailsPage";
import OrderList from "../pages/Orders/OrderList";
import OrderDetails from "../pages/Orders/OrderDetails";
import Reports from "../pages/Reports/Reports";
import SettingsPage from "../pages/Settings/SettingsPage";

function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public Admin Routes */}
        <Route path="login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/:id" element={<CustomerDetailsPage />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Catch-all admin routes to redirect to dashboard */}
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}

export default AdminRoutes;
