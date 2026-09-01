import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import vendorService from "../services/vendorService";

function BecomeSeller({ cart = {}, wishlist = [], user, setUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [vendorProfile, setVendorProfile] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    business_name: "",
    store_name: "",
    business_email: "",
    business_phone: "",
    address_type: "BUSINESS",
    address_full_name: "",
    address_phone: "",
    address_line_1: "",
    address_line_2: "",
    address_city: "",
    address_state: "",
    address_country: "India",
    address_postal_code: "",
    bank_account_holder_name: "",
    bank_account_number: "",
    bank_name: "",
    bank_branch_name: "",
    bank_ifsc_code: "",
  });

  const [documents, setDocuments] = useState({
    GSTIN_file: null,
    GSTIN_number: "",
    PAN_file: null,
    PAN_number: "",
    BUSINESS_REGISTRATION_file: null,
    BUSINESS_REGISTRATION_number: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const checkExistingApplication = async () => {
      try {
        const profile = await vendorService.getVendorProfile();
        setVendorProfile(profile);
        if (profile) {
          // Pre-populate if rejected or pending
          setFormData({
            business_name: profile.business_name || "",
            store_name: profile.store_name || "",
            business_email: profile.business_email || "",
            business_phone: profile.business_phone || "",
            address_type: profile.addresses?.[0]?.address_type || "BUSINESS",
            address_full_name: profile.addresses?.[0]?.full_name || "",
            address_phone: profile.addresses?.[0]?.phone || "",
            address_line_1: profile.addresses?.[0]?.address_line_1 || "",
            address_line_2: profile.addresses?.[0]?.address_line_2 || "",
            address_city: profile.addresses?.[0]?.city || "",
            address_state: profile.addresses?.[0]?.state || "",
            address_country: profile.addresses?.[0]?.country || "India",
            address_postal_code: profile.addresses?.[0]?.postal_code || "",
            bank_account_holder_name: profile.bank_account?.account_holder_name || "",
            bank_account_number: profile.bank_account?.account_number || "",
            bank_name: profile.bank_account?.bank_name || "",
            bank_branch_name: profile.bank_account?.branch_name || "",
            bank_ifsc_code: profile.bank_account?.ifsc_code || "",
          });
        }
      } catch (err) {
        // No application exists yet, which is fine
      }
    };

    checkExistingApplication();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setDocuments((prev) => ({ ...prev, [`${type}_file`]: file }));
  };

  const handleDocNumberChange = (e, type) => {
    const { value } = e.target;
    setDocuments((prev) => ({ ...prev, [`${type}_number`]: value }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    // Add business parameters
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Add documents
    let docAdded = false;
    ["GSTIN", "PAN", "BUSINESS_REGISTRATION"].forEach((type) => {
      if (documents[`${type}_file`]) {
        data.append(`document_file_${type}`, documents[`${type}_file`]);
        data.append(`document_number_${type}`, documents[`${type}_number`]);
        docAdded = true;
      }
    });

    if (!vendorProfile && !docAdded) {
      setError("Please upload at least one verification document (e.g. GSTIN or PAN).");
      setLoading(false);
      return;
    }

    try {
      if (vendorProfile) {
        // Edit/Update flow
        const updated = await vendorService.updateVendorProfile(data);
        setVendorProfile(updated);
        setSuccess(true);
      } else {
        // Initial application
        const created = await vendorService.applyVendor(data);
        setVendorProfile(created);
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Application submission failed. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const resubmitted = await vendorService.resubmitVendor();
      setVendorProfile(resubmitted);
      setSuccess(true);
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.detail || "Resubmission failed.");
    } finally {
      setLoading(false);
    }
  };

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  // If application exists and is PENDING or APPROVED, display status card
  if (vendorProfile && (vendorProfile.status === "PENDING" || vendorProfile.status === "APPROVED" || vendorProfile.status === "SUSPENDED")) {
    return (
      <MainLayout cartCount={cartCount} wishlistCount={wishlist.length} user={user} setUser={setUser}>
        <div className="container" style={{ padding: "80px 20px", maxWidth: "600px" }}>
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "45px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
            textAlign: "center",
            border: "1px solid #f1f5f9"
          }}>
            {vendorProfile.status === "PENDING" && (
              <>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", margin: "0 auto 24px auto" }}>⏳</div>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>Application Under Review</h2>
                <p style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6", marginBottom: "30px" }}>
                  Thank you for applying! Your business application for <strong>{vendorProfile.business_name}</strong> is currently pending admin verification. We will notify you once approved.
                </p>
                <button onClick={() => navigate("/profile")} style={{ padding: "12px 28px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "none", color: "#475569", fontWeight: "600", cursor: "pointer" }}>Back to Account</button>
              </>
            )}

            {vendorProfile.status === "APPROVED" && (
              <>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", margin: "0 auto 24px auto" }}>🎉</div>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>Application Approved!</h2>
                <p style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6", marginBottom: "30px" }}>
                  Congratulations! Your seller account for <strong>{vendorProfile.store_name}</strong> is fully active. You can now access future vendor dashboard components.
                </p>
                <button onClick={() => navigate("/profile")} style={{ padding: "12px 28px", borderRadius: "12px", background: "#7c3aed", color: "white", border: "none", fontWeight: "600", cursor: "pointer" }}>Go to Profile</button>
              </>
            )}

            {vendorProfile.status === "SUSPENDED" && (
              <>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#fee2fee2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", margin: "0 auto 24px auto" }}>🚫</div>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>Account Suspended</h2>
                <p style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6", marginBottom: "30px" }}>
                  Your selling privileges for <strong>{vendorProfile.store_name}</strong> have been suspended. Please contact admin support for assistance.
                </p>
              </>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout cartCount={cartCount} wishlistCount={wishlist.length} user={user} setUser={setUser}>
      <div className="container" style={{ padding: "60px 20px", maxWidth: "800px" }}>
        
        {/* Step Indicator Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "#7c3aed", letterSpacing: "1px" }}>Step {step} of 5</span>
            <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "5px 0 0 0" }}>
              {step === 1 && "Business Information"}
              {step === 2 && "Business Address"}
              {step === 3 && "Verification Documents"}
              {step === 4 && "Bank Account Details"}
              {step === 5 && "Review & Submit"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} style={{ width: "30px", height: "6px", borderRadius: "3px", background: s <= step ? "#7c3aed" : "#e2e8f0", transition: "all 0.3s ease" }} />
            ))}
          </div>
        </div>

        {error && (
          <div style={{ padding: "16px 20px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: "12px", marginBottom: "30px", fontSize: "15px", fontWeight: "500" }}>
            ⚠️ {error}
          </div>
        )}

        {vendorProfile?.status === "REJECTED" && step === 1 && (
          <div style={{ padding: "20px", background: "#fffbeb", border: "1px solid #fde68a", color: "#b45309", borderRadius: "16px", marginBottom: "30px" }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: "800" }}>Rejection Reason from Admin:</h3>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>{vendorProfile.rejection_reason || "Your application was rejected. Please review and update details."}</p>
          </div>
        )}

        <form onSubmit={handleApply} style={{ background: "white", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
          
          {/* Step 1: Business Details */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Legal Business Name</label>
                <input type="text" name="business_name" value={formData.business_name} onChange={handleInputChange} required placeholder="Example Corp LLC" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Customer-Facing Store Name</label>
                <input type="text" name="store_name" value={formData.store_name} onChange={handleInputChange} required placeholder="Example Store" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Business Email</label>
                <input type="email" name="business_email" value={formData.business_email} onChange={handleInputChange} required placeholder="billing@examplestore.com" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Business Phone</label>
                <input type="text" name="business_phone" value={formData.business_phone} onChange={handleInputChange} required placeholder="+91 9999999999" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
            </div>
          )}

          {/* Step 2: Address Details */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Address Type</label>
                <select name="address_type" value={formData.address_type} onChange={handleInputChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "white" }}>
                  <option value="BUSINESS">Business Office</option>
                  <option value="WAREHOUSE">Warehouse</option>
                  <option value="RETURN">Return Center</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Contact Person Full Name</label>
                <input type="text" name="address_full_name" value={formData.address_full_name} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Contact Phone</label>
                <input type="text" name="address_phone" value={formData.address_phone} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Address Line 1</label>
                <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Address Line 2 (Optional)</label>
                <input type="text" name="address_line_2" value={formData.address_line_2} onChange={handleInputChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>City</label>
                  <input type="text" name="address_city" value={formData.address_city} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>State</label>
                  <input type="text" name="address_state" value={formData.address_state} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Postal Code</label>
                  <input type="text" name="address_postal_code" value={formData.address_postal_code} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Country</label>
                  <input type="text" name="address_country" value={formData.address_country} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc" }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents Upload */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>GSTIN Verification</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input type="text" placeholder="GSTIN Number" value={documents.GSTIN_number} onChange={(e) => handleDocNumberChange(e, "GSTIN")} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                  <input type="file" onChange={(e) => handleFileChange(e, "GSTIN")} style={{ fontSize: "14px" }} />
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>PAN Verification</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input type="text" placeholder="PAN Number" value={documents.PAN_number} onChange={(e) => handleDocNumberChange(e, "PAN")} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                  <input type="file" onChange={(e) => handleFileChange(e, "PAN")} style={{ fontSize: "14px" }} />
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Business Registration License</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input type="text" placeholder="License Number" value={documents.BUSINESS_REGISTRATION_number} onChange={(e) => handleDocNumberChange(e, "BUSINESS_REGISTRATION")} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                  <input type="file" onChange={(e) => handleFileChange(e, "BUSINESS_REGISTRATION")} style={{ fontSize: "14px" }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Bank Account */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Account Holder Name</label>
                <input type="text" name="bank_account_holder_name" value={formData.bank_account_holder_name} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Account Number</label>
                <input type="text" name="bank_account_number" value={formData.bank_account_number} onChange={handleInputChange} required placeholder="Enter full numeric bank account number" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Bank Name</label>
                <input type="text" name="bank_name" value={formData.bank_name} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>Branch Name</label>
                <input type="text" name="bank_branch_name" value={formData.bank_branch_name} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155" }}>IFSC Code</label>
                <input type="text" name="bank_ifsc_code" value={formData.bank_ifsc_code} onChange={handleInputChange} required placeholder="SBIN0001234" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
              <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700" }}>Business & Store</h3>
                <p style={{ margin: "4px 0" }}><strong>Legal Name:</strong> {formData.business_name}</p>
                <p style={{ margin: "4px 0" }}><strong>Store Name:</strong> {formData.store_name}</p>
                <p style={{ margin: "4px 0" }}><strong>Email:</strong> {formData.business_email}</p>
                <p style={{ margin: "4px 0" }}><strong>Phone:</strong> {formData.business_phone}</p>
              </div>

              <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700" }}>Business Address</h3>
                <p style={{ margin: "4px 0" }}>{formData.address_full_name} ({formData.address_type})</p>
                <p style={{ margin: "4px 0" }}>{formData.address_line_1}, {formData.address_line_2}</p>
                <p style={{ margin: "4px 0" }}>{formData.address_city}, {formData.address_state} - {formData.address_postal_code}</p>
              </div>

              <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700" }}>Bank Account</h3>
                <p style={{ margin: "4px 0" }}><strong>Holder Name:</strong> {formData.bank_account_holder_name}</p>
                <p style={{ margin: "4px 0" }}><strong>Bank:</strong> {formData.bank_name} ({formData.bank_branch_name})</p>
                <p style={{ margin: "4px 0" }}><strong>IFSC:</strong> {formData.bank_ifsc_code}</p>
              </div>

              <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700" }}>Documents Uploaded</h3>
                {documents.GSTIN_file && <p style={{ margin: "4px 0" }}>✓ GSTIN Document ({documents.GSTIN_number})</p>}
                {documents.PAN_file && <p style={{ margin: "4px 0" }}>✓ PAN Document ({documents.PAN_number})</p>}
                {documents.BUSINESS_REGISTRATION_file && <p style={{ margin: "4px 0" }}>✓ Business Registration ({documents.BUSINESS_REGISTRATION_number})</p>}
                {!documents.GSTIN_file && !documents.PAN_file && !documents.BUSINESS_REGISTRATION_file && vendorProfile && <p style={{ margin: "4px 0" }}>✓ Retaining previously uploaded documents</p>}
              </div>

              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
                By submitting, you certify that all business, financial, and legal verification documents provided are accurate and valid. False information may result in immediate suspension.
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} style={{ padding: "12px 24px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "none", color: "#475569", fontWeight: "600", cursor: "pointer" }}>Back</button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button type="button" onClick={() => setStep(step + 1)} style={{ padding: "12px 24px", borderRadius: "12px", background: "#7c3aed", color: "white", border: "none", fontWeight: "600", cursor: "pointer" }}>Next Step &rarr;</button>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                {vendorProfile?.status === "REJECTED" && (
                  <button type="button" onClick={handleResubmit} disabled={loading} style={{ padding: "12px 24px", borderRadius: "12px", background: "#2563eb", color: "white", border: "none", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Resubmitting..." : "Resubmit Application"}
                  </button>
                )}
                <button type="submit" disabled={loading} style={{ padding: "12px 24px", borderRadius: "12px", background: "#16a34a", color: "white", border: "none", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Submitting..." : (vendorProfile ? "Save Changes" : "Submit Application")}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default BecomeSeller;
