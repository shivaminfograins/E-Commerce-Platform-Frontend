import React, { useState, useEffect } from "react";
import vendorService from "../services/vendorService";

function VendorStoreProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    business_name: "",
    store_name: "",
    business_email: "",
    business_phone: "",
    address_full_name: "",
    address_phone: "",
    address_line_1: "",
    address_line_2: "",
    address_city: "",
    address_state: "",
    address_postal_code: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await vendorService.getVendorProfile();
        setProfile(data);
        const primaryAddress = data.addresses?.[0] || {};
        setFormData({
          business_name: data.business_name || "",
          store_name: data.store_name || "",
          business_email: data.business_email || "",
          business_phone: data.business_phone || "",
          address_full_name: primaryAddress.full_name || "",
          address_phone: primaryAddress.phone || "",
          address_line_1: primaryAddress.address_line_1 || "",
          address_line_2: primaryAddress.address_line_2 || "",
          address_city: primaryAddress.city || "",
          address_state: primaryAddress.state || "",
          address_postal_code: primaryAddress.postal_code || "",
        });
      } catch (err) {
        setError("Failed to load store profile details.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      await vendorService.updateVendorProfile(formData);
      setSuccess("Profile settings successfully updated.");
    } catch (err) {
      if (err.response && err.response.data) {
        const errorDetails = Object.entries(err.response.data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
          .join(" | ");
        setError(errorDetails || "Failed to update profile.");
      } else {
        setError("An error occurred while saving updates.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: "#64748b", fontSize: "15px", fontWeight: "600" }}>Loading profile details...</div>;
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>Store Settings</h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "16px" }}>Manage your store identity, contacts, and warehouse shipment address.</p>
      </div>

      {success && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "16px", borderRadius: "12px", marginBottom: "24px", fontWeight: "600" }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", padding: "16px", borderRadius: "12px", marginBottom: "24px", fontWeight: "600" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Section 1: Business Identity */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>Business Identity</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Legal Business Name</label>
              <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Public Store Name</label>
              <input type="text" name="store_name" value={formData.store_name} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Info */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>Business Contact Info</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Official Email</label>
              <input type="email" name="business_email" value={formData.business_email} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Phone Number</label>
              <input type="text" name="business_phone" value={formData.business_phone} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Address */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>Business Location</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Full Address Name</label>
                <input type="text" name="address_full_name" value={formData.address_full_name} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Address Phone</label>
                <input type="text" name="address_phone" value={formData.address_phone} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Street Line 1</label>
              <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Street Line 2 (Optional)</label>
              <input type="text" name="address_line_2" value={formData.address_line_2} onChange={handleChange} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>City</label>
                <input type="text" name="address_city" value={formData.address_city} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>State</label>
                <input type="text" name="address_state" value={formData.address_state} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Postal Code</label>
                <input type="text" name="address_postal_code" value={formData.address_postal_code} onChange={handleChange} required style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
          <button type="submit" disabled={saving} style={{ padding: "12px 24px", borderRadius: "10px", background: "#3b82f6", color: "white", border: "none", fontWeight: "700", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VendorStoreProfile;
