function ProfileCard({ user }) {
  const name = user?.fullName || "Guest User";
  const email = user?.email || "";
  const phone = user?.phone || "+91 9876543210";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="profile-card" style={{ display: "flex", gap: "40px", padding: "40px", background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, .05)", marginBottom: "40px" }}>
      <div className="profile-left" style={{ width: "250px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "20px",
          boxShadow: "0 8px 16px rgba(79, 70, 229, 0.2)",
          border: "4px solid #f1f5f9"
        }}>
          {initials}
        </div>

        <button className="btn btn--outline" style={{ border: "1px solid #cbd5e1", borderRadius: "10px", padding: "8px 16px", cursor: "pointer", fontWeight: "600", fontSize: "14px", color: "#475569", background: "none" }}>Edit Profile</button>
      </div>

      <div className="profile-right" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{name}</h2>

        <p style={{ fontSize: "16px", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          {email}
        </p>

        <p style={{ fontSize: "16px", color: "#64748b", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          {phone}
        </p>

        <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Member Since June 2026</p>

        <button className="btn btn--primary" style={{ alignSelf: "flex-start", marginTop: "10px", padding: "10px 20px", borderRadius: "10px", backgroundColor: "#0f172a", color: "white", border: "none", fontWeight: "600", cursor: "pointer" }}>Change Password</button>
      </div>
    </div>
  );
}

export default ProfileCard;
