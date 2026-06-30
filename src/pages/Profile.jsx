import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import ProfileCard from "../components/account/ProfileCard";
import AccountStats from "../components/account/AccountStats";
import RecentOrders from "../components/account/RecentOrders";
import profileService from "../services/profileService";

function Profile({ cart = {}, wishlist = [], user, setUser }) {
  const navigate = useNavigate();

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

    if (user) {
      loadProfile();
    }
  }, [setUser]);

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

        <AccountStats cartCount={cartCount} wishlistCount={wishlist.length} />

        <RecentOrders />
      </div>
    </MainLayout>
  );
}

export default Profile;
