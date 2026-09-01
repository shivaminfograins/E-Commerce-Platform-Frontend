import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Categories from "../pages/Categories/Categories";
import CategoryImages from "../pages/Categories/CategoryImages";
import Brands from "../pages/Brands/Brands";
import Products from "../pages/Products/Products";
import ProductCreate from "../pages/Products/ProductCreate";
import ProductUpdate from "../pages/Products/ProductUpdate";
import ProductDetails from "../pages/Products/ProductDetails";
import ProductVariants from "../pages/Products/ProductVariants";
import ProductImages from "../pages/Products/ProductImages";
import CustomerList from "../pages/Customers/CustomerList";
import CustomerDetailsPage from "../pages/Customers/CustomerDetailsPage";
import OrderList from "../pages/Orders/OrderList";
import OrderDetails from "../pages/Orders/OrderDetails";
import Reports from "../pages/Reports/Reports";
import SettingsPage from "../pages/Settings/SettingsPage";
import Coupons from "../pages/Coupons/Coupons";
import Notifications from "../pages/Notifications/Notifications";
import AdminReviews from "../pages/Reviews/AdminReviews";
import VendorList from "../pages/Vendors/VendorList";
import VendorDetail from "../pages/Vendors/VendorDetail";

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
          <Route path="category-images" element={<CategoryImages />} />
          <Route path="brands" element={<Brands />} />
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="products/:id/edit" element={<ProductUpdate />} />
          <Route path="product-variants" element={<ProductVariants />} />
          <Route path="product-images" element={<ProductImages />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/:id" element={<CustomerDetailsPage />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="vendors" element={<VendorList />} />
          <Route path="vendors/:id" element={<VendorDetail />} />
          {/* Catch-all admin routes to redirect to dashboard */}
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}

export default AdminRoutes;
