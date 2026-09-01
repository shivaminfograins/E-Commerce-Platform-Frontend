import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import ProfileCard from "../components/account/ProfileCard";
import AccountStats from "../components/account/AccountStats";
import RecentOrders from "../components/account/RecentOrders";
import profileService from "../services/profileService";
import addressService from "../services/addressService";
import orderService from "../services/orderService";
import vendorService from "../services/vendorService";

function Profile({ cart = {}, wishlist = [], user, setUser }) {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [ordersCount, setOrdersCount] = useState(0);
  const [addressesCount, setAddressesCount] = useState(0);
  const [vendorProfile, setVendorProfile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await profileService.getProfile();
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            phone: profileData.phone,
            dateOfBirth: profileData.date_of_birth,
            profileImage: profileData.profile_image,
          };
        });
      } catch (err) {
        console.error("Failed to load user profile from backend:", err);
      }
    };

    const loadAddresses = async () => {
      try {
        const addressData = await addressService.getAddresses();
        setAddresses(addressData.slice(0, 2)); // Show up to 2 addresses in summary
        setAddressesCount(addressData.length);
      } catch (err) {
        console.error("Failed to load addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    const loadOrdersCount = async () => {
      try {
        const response = await orderService.getOrders({ page: 1, page_size: 1 });
        if (response.data.success) {
          setOrdersCount(response.data.count);
        }
      } catch (err) {
        console.error("Failed to load orders count:", err);
      }
    };

    const loadVendorStatus = async () => {
      try {
        const profile = await vendorService.getVendorProfile();
        setVendorProfile(profile);
      } catch (err) {
        // No application exists
      }
    };

    if (user) {
      loadProfile();
      loadAddresses();
      loadOrdersCount();
      loadVendorStatus();
    }
  }, [setUser, user?.id]);

  if (!user) return null;

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  return (
    <MainLayout
      cartCount={cartCount}
      wishlistCount={wishlist.length}
      user={user}
      setUser={setUser}
    >
      <div className="container" style={{ padding: "45px 20px" }}>
        <h1 className="page-title" style={{ marginBottom: "30px", fontWeight: "800", color: "#0f172a" }}>My Account</h1>

        <ProfileCard user={user} onUserUpdate={setUser} />

        {/* Vendor/Seller Integration Card */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: "20px",
          padding: "30px 40px",
          color: "#f8fafc",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
        }}>
          <div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "800" }}>
              {!vendorProfile && "Start Selling on ShopEase"}
              {vendorProfile?.status === "PENDING" && "Seller Application Pending"}
              {vendorProfile?.status === "APPROVED" && "Vendor Store Active"}
              {vendorProfile?.status === "REJECTED" && "Seller Application Rejected"}
              {vendorProfile?.status === "SUSPENDED" && "Seller Account Suspended"}
            </h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>
              {!vendorProfile && "Create your store, upload verification documents, and start earning."}
              {vendorProfile?.status === "PENDING" && `Your application for "${vendorProfile.business_name}" is currently under review.`}
              {vendorProfile?.status === "APPROVED" && `Manage your seller profile and details for "${vendorProfile.store_name}".`}
              {vendorProfile?.status === "REJECTED" && `Reason: ${vendorProfile.rejection_reason || "Invalid documentation. Please edit and resubmit."}`}
              {vendorProfile?.status === "SUSPENDED" && "Your seller privileges are suspended. Please contact platform support."}
            </p>
          </div>
          {vendorProfile?.status !== "SUSPENDED" && (
            <Link to="/become-seller" style={{
              background: vendorProfile?.status === "REJECTED" ? "#dc2626" : "#7c3aed",
              color: "white",
              padding: "12px 24px",
              borderRadius: "10px",
              fontWeight: "700",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}>
              {!vendorProfile && "Register Store"}
              {vendorProfile?.status === "PENDING" && "View Details"}
              {vendorProfile?.status === "APPROVED" && "Manage Store"}
              {vendorProfile?.status === "REJECTED" && "Edit & Resubmit"}
            </Link>
          )}
        </div>

        <AccountStats 
          cartCount={cartCount} 
          wishlistCount={wishlist.length} 
          ordersCount={ordersCount}
          addressesCount={addressesCount}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "40px" }}>
          
          {/* Recent Orders Section */}
          <RecentOrders />

          {/* Saved Addresses Summary Section */}
          <div className="saved-addresses-summary">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>Saved Addresses</h2>
              <Link to="/address-book" style={{ fontSize: "14px", fontWeight: "600", color: "#7c3aed", textDecoration: "none" }}>
                Manage Addresses &rarr;
              </Link>
            </div>

            {loadingAddresses ? (
              <p style={{ color: "#64748b", fontSize: "14px" }}>Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <div style={{ padding: "30px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9", textAlign: "center" }}>
                <p style={{ margin: "0 0 12px 0", color: "#64748b", fontSize: "14px" }}>No saved addresses found.</p>
                <Link to="/address-book" style={{ color: "#7c3aed", fontWeight: "700", textDecoration: "none", fontSize: "14px" }}>Add Address &rarr;</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #f1f5f9",
                      borderRadius: "16px",
                      padding: "16px 20px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.01)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <strong style={{ fontSize: "15px", color: "#0f172a" }}>{addr.full_name}</strong>
                      <span style={{ fontSize: "11px", fontWeight: "700", background: addr.is_default ? "#faf5ff" : "#f1f5f9", border: `1px solid ${addr.is_default ? "#e9d5ff" : "#e2e8f0"}`, color: addr.is_default ? "#7c3aed" : "#475569", padding: "2px 8px", borderRadius: "100px" }}>
                        {addr.is_default ? "Default" : "Saved"}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.4" }}>
                      {addr.address_line_1}
                      {addr.address_line_2 && `, ${addr.address_line_2}`}
                      <br />{addr.city}, {addr.state} – {addr.postal_code}
                    </p>
                    <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#64748b" }}>📱 {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;
