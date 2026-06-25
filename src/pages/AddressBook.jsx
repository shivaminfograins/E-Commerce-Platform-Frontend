import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AddressCard from "../components/address/AddressCard";
import initialAddresses from "../data/address";

function AddressBook({ cart = {}, wishlist = [], user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_addresses");
      return saved ? JSON.parse(saved) : initialAddresses;
    } catch {
      return initialAddresses;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    type: "Home",
    isDefault: false
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem("shopease_addresses", JSON.stringify(addresses));
    } catch (e) {
      console.warn("localStorage is not available for saving addresses:", e);
    }
  }, [addresses]);

  if (!user) return null;

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      fullName: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      type: "Home",
      isDefault: addresses.length === 0 // default if first address
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData({ ...addr });
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
    if (!formData.zipCode.trim()) errors.zipCode = "ZIP/PIN code is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let updatedAddresses;

    if (editingAddress) {
      // Edit
      updatedAddresses = addresses.map((addr) =>
        addr.id === editingAddress.id ? { ...formData } : addr
      );
    } else {
      // Add
      const newAddress = {
        ...formData,
        id: `addr-${Date.now()}`
      };
      updatedAddresses = [...addresses, newAddress];
    }

    // Handle isDefault logic (only one address can be default)
    if (formData.isDefault) {
      const targetId = editingAddress ? editingAddress.id : updatedAddresses[updatedAddresses.length - 1].id;
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === targetId
      }));
    } else if (editingAddress && editingAddress.isDefault) {
      // Prevent unchecking default if it's the only one, or force another to be default
      const defaultCount = updatedAddresses.filter(a => a.isDefault).length;
      if (defaultCount === 0 && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
    }

    setAddresses(updatedAddresses);
    setIsModalOpen(false);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updated = addresses.filter((addr) => addr.id !== id);
      // If we deleted the default address, make another one default
      const wasDefault = addresses.find(a => a.id === id)?.isDefault;
      if (wasDefault && updated.length > 0) {
        updated[0].isDefault = true;
      }
      setAddresses(updated);
    }
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updated);
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

        {/* Address Cards Grid */}
        {sortedAddresses.length > 0 ? (
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
                    placeholder="Enter 10-digit number"
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
                      placeholder="6-digit ZIP code"
                      style={{ width: "100%", height: "45px", padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px" }}
                    />
                    {formErrors.zipCode && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.zipCode}</span>}
                  </div>
                </div>

                {/* State & Type */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className={`input-group ${formErrors.state ? "has-error" : ""}`}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State name"
                      style={{ width: "100%", height: "45px", padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px" }}
                    />
                    {formErrors.state && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.state}</span>}
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "6px" }}>Address Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      style={{ width: "100%", height: "45px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "10px", background: "white", fontSize: "14px" }}
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
