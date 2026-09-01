import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";

function VendorLayout({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("shopease_user");
    setUser(null);
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/vendor/dashboard", icon: "📊" },
    { name: "Store Profile", path: "/vendor/profile", icon: "🏪" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", background: "#0f172a", color: "#f8fafc", display: "flex", flexDirection: "column", borderRight: "1px solid #1e293b", position: "fixed", top: 0, bottom: 0, left: 0 }}>
        <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #1e293b" }}>
          <span style={{ fontSize: "24px" }}>🛍️</span>
          <span style={{ fontSize: "20px", fontWeight: "800", background: "linear-gradient(to right, #a78bfa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ShopEase Seller</span>
        </div>

        <nav style={{ flex: 1, padding: "24px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  background: isActive ? "#3b82f6" : "transparent",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "15px",
                  transition: "all 0.2s"
                }}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: "#94a3b8",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.2s"
            }}
          >
            <span>🏠</span>
            Back to Store
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              color: "#f87171",
              background: "transparent",
              border: "none",
              width: "100%",
              textAlign: "left",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, marginLeft: "260px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ height: "70px", background: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 40px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#3b82f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: "600", color: "#334155" }}>{user?.username}</span>
          </div>
        </header>

        {/* Dynamic nested route content */}
        <div style={{ padding: "40px", flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default VendorLayout;
