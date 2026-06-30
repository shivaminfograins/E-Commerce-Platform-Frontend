import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AddressCard from "../components/address/AddressCard";
import addressService from "../services/addressService";

function AddressBook({ cart = {}, wishlist = [], user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    streetAddress: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    type: "Home",
    isDefault: false
  });
  const [formErrors, setFormErrors] = useState({});

  const normalizeAddress = (addr) => ({
    id: addr.id,
    fullName: addr.full_name,
    phone: addr.phone,
    streetAddress: addr.address_line_1,
    addressLine2: addr.address_line_2 || "",
    city: addr.city,
    state: addr.state,
    country: addr.country || "India",
    zipCode: addr.postal_code,
    type: "Home", // Default since backend does not store address type
    isDefault: addr.is_default
  });

  const loadAddresses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await addressService.getAddresses();
      setAddresses(data.map(normalizeAddress));
    } catch (err) {
      console.error("Failed to load addresses:", err);
      setError("Failed to load addresses from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  if (!user) return null;

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      fullName: "",
      phone: "",
      streetAddress: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      zipCode: "",
      type: "Home",
      isDefault: addresses.length === 0 // default if first address
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      streetAddress: addr.streetAddress || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "",
      state: addr.state || "",
      country: addr.country || "India",
      zipCode: addr.zipCode || "",
      type: addr.type || "Home",
      isDefault: addr.isDefault || false
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.streetAddress.trim()) errors.streetAddress = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.zipCode.trim()) errors.zipCode = "ZIP/PIN code is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    const payload = {
      full_name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      address_line_1: formData.streetAddress.trim(),
      address_line_2: formData.addressLine2 ? formData.addressLine2.trim() : "",
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      postal_code: formData.zipCode.trim(),
      is_default: formData.isDefault
    };

    try {
      let savedAddr;
      if (editingAddress) {
        savedAddr = await addressService.patchAddress(editingAddress.id, payload);
      } else {
        savedAddr = await addressService.createAddress(payload);
      }

      // Handle default address backend sync
      if (payload.is_default) {
        const otherDefaults = addresses.filter(
          (a) => a.isDefault && a.id !== (editingAddress ? editingAddress.id : savedAddr.id)
        );
        for (const addr of otherDefaults) {
          await addressService.patchAddress(addr.id, { is_default: false });
        }
      }

      await loadAddresses();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save address:", err);
      setError("Failed to save address. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setIsLoading(true);
      setError("");
      try {
        const addressToDelete = addresses.find((a) => a.id === id);
        await addressService.deleteAddress(id);
        
        // If we deleted the default address, promote another one if available
        const remaining = addresses.filter((addr) => addr.id !== id);
        if (addressToDelete?.isDefault && remaining.length > 0) {
          await addressService.patchAddress(remaining[0].id, { is_default: true });
        }
        await loadAddresses();
      } catch (err) {
        console.error("Failed to delete address:", err);
        setError("Failed to delete address from server.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSetDefault = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await addressService.patchAddress(id, { is_default: true });
      const otherDefaults = addresses.filter((a) => a.isDefault && a.id !== id);
      for (const addr of otherDefaults) {
        await addressService.patchAddress(addr.id, { is_default: false });
      }
      await loadAddresses();
    } catch (err) {
      console.error("Failed to set default address:", err);
      setError("Failed to set default address.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sort default first
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  return (
    <MainLayout
      cartCount={cartCount}
      wishlistCount={wishlist.length}
      user={user}
      setUser={setUser}
    >
      <div className="container" style={{ padding: "40px 20px" }}>
        {/* Header Block */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 className="page-title" style={{ margin: 0, fontWeight: "800", color: "#0f172a" }}>My Address Book</h1>
            <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "16px" }}>Manage shipping addresses for checkout</p>
          </div>
          <button className="btn btn--primary" onClick={openAddModal} style={{ display: "inline-flex", gap: "8px", alignItems: "center", fontWeight: "600" }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Address
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div style={{ padding: "14px 20px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: "12px", marginBottom: "25px", fontSize: "14px", fontWeight: "500" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && addresses.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px 0" }}>
            <div style={{ width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #7c3aed", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : sortedAddresses.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
            {sortedAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={openEditModal}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: "20px" }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h2>No addresses saved</h2>
            <p style={{ color: "#64748b", margin: "10px auto 30px", maxWidth: "400px" }}>
              Please add a shipping address to speed up checkout and order placements.
            </p>
            <button className="btn btn--primary" onClick={openAddModal}>
              Add Address
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="cart-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="cart-modal-content" style={{ maxWidth: "500px", height: "auto", maxHeight: "95vh" }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="cart-modal-header">
              <h2 style={{ margin: 0, fontSize: "18px" }}>
                {editingAddress ? "Edit Address" : "Add Shipping Address"}
              </h2>
              <button className="cart-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAddress}>
              <div className="cart-modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px 24px" }}>
                
                {/* Full Name */}
                <div className={`input-group ${formErrors.fullName ? "has-error" : ""}`}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    style={{ width: "100%", height: "45px", padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px" }}
                  />
                  {formErrors.fullName && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.fullName}</span>}
                </div>

                {/* Phone */}
                <div className={`input-group ${formErrors.phone ? "has-error" : ""}`}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    style={{ width: "100%", height: "45px", padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px" }}
                  />
                  {formErrors.phone && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.phone}</span>}
                </div>

                {/* Street Address */}
                <div className={`input-group ${formErrors.streetAddress ? "has-error" : ""}`}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>Street Address *</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="Flat / House no, Building, Street, Area"
                    style={{ width: "100%", height: "45px", padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px" }}
                  />
                  {formErrors.streetAddress && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.streetAddress}</span>}
                </div>

                {/* Address Line 2 */}
                <div className="input-group">
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>Apartment, Suite, Unit, etc. (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Apt, Suite, Unit, etc."
                    style={{ width: "100%", height: "45px", padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px" }}
                  />
                </div>

                {/* City & ZIP */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className={`input-group ${formErrors.city ? "has-error" : ""}`}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City name"
                      style={{ width: "100%", height: "45px", padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px" }}
                    />
                    {formErrors.city && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.city}</span>}
                  </div>
                  <div className={`input-group ${formErrors.zipCode ? "has-error" : ""}`}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>ZIP / PIN Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="ZIP code"
                      style={{ width: "100%", height: "45px", padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px" }}
                    />
                    {formErrors.zipCode && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.zipCode}</span>}
                  </div>
                </div>

                {/* State, Country & Type */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div className={`input-group ${formErrors.state ? "has-error" : ""}`}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      style={{ width: "100%", height: "45px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "13px" }}
                    />
                    {formErrors.state && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.state}</span>}
                  </div>
                  <div className={`input-group ${formErrors.country ? "has-error" : ""}`}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      style={{ width: "100%", height: "45px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "13px" }}
                    />
                    {formErrors.country && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.country}</span>}
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>Address Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      style={{ width: "100%", height: "45px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "10px", background: "white", fontSize: "13px" }}
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                    </select>
                  </div>
                </div>

                {/* Default checkbox */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    style={{ width: "16px", height: "16px", accentColor: "#7c3aed" }}
                  />
                  <label htmlFor="isDefault" style={{ fontSize: "14px", fontWeight: "600", color: "#334155", cursor: "pointer" }}>Set as default address</label>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="cart-modal-footer" style={{ display: "flex", gap: "12px", background: "#f8fafc", padding: "16px 24px", borderTop: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn"
                  style={{ flex: 1, height: "46px", background: "white", border: "1px solid #cbd5e1", borderRadius: "10px", fontWeight: "600", color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  style={{ flex: 1, height: "46px", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default AddressBook;
