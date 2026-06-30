import { useState, useEffect } from "react";
import profileService from "../../services/profileService";

function EditProfileModal({ user, isOpen, onClose, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setPhone(user.phone || "");
      setDateOfBirth(user.dateOfBirth || "");
      setError("");
      setSuccess("");
      setProfileImageFile(null);

      const getProfileImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http://") || path.startsWith("https://")) {
          return path;
        }
        let baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        // Strip trailing slash and any trailing "/api"
        baseUrl = baseUrl.replace(/\/$/, "").replace(/\/api$/, "");
        return `${baseUrl}${path}`;
      };
      setImagePreviewUrl(getProfileImageUrl(user.profileImage));
    }
  }, [isOpen, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("phone", phone.trim());

      if (dateOfBirth) {
        formData.append("date_of_birth", dateOfBirth);
      }
      
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      const response = await profileService.patchProfile(formData);

      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        onSuccess(response);
        onClose();
      }, 1500);
    } catch (err) {
      const data = err?.response?.data;
      let message = "";
      if (data) {
        if (typeof data === "string") {
          message = data;
        } else if (data.detail) {
          message = data.detail;
        } else if (data.message) {
          message = data.message;
        } else if (data.error) {
          message = data.error;
        } else {
          // Parse field-specific validation errors
          message = Object.entries(data)
            .map(([field, msgs]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ");
              const errors = Array.isArray(msgs) ? msgs.join(" ") : msgs;
              return `${fieldName}: ${errors}`;
            })
            .join(" | ");
        }
      }
      if (!message) {
        message = "Failed to update profile. Please try again.";
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0 }}>
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#dcfce7",
              border: "1px solid #86efac",
              color: "#16a34a",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Image Section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "25px" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "3px solid #f1f5f9",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8fafc",
                color: "#64748b",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "12px",
                position: "relative"
              }}
            >
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"
              )}
            </div>
            <label
              htmlFor="profile-image-upload"
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#475569",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Change Photo
            </label>
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              style={{ display: "none" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#0f172a",
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#0f172a",
              }}
            >
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "white",
                color: "#475569",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#7c3aed",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
