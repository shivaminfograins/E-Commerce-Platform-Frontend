import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!fullName.trim()) {
      tempErrors.fullName = "Full Name is required";
    } else if (fullName.trim().length < 3) {
      tempErrors.fullName = "Full Name must be at least 3 characters";
    }

    if (!email) {
      tempErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!mobile) {
      tempErrors.mobile = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(mobile)) {
      tempErrors.mobile = "Mobile Number must be a valid 10-digit number";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeTerms) {
      tempErrors.agreeTerms = "You must agree to the Terms & Conditions";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      try {
        const registeredUsers = JSON.parse(localStorage.getItem("shopease_users") || "[]");

        // Check if email already registered
        const emailExists = registeredUsers.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (emailExists) {
          setApiError("Email is already registered. Please sign in instead.");
          setIsLoading(false);
          return;
        }

        // Add new user
        const newUser = {
          fullName,
          email,
          mobile,
          password
        };

        registeredUsers.push(newUser);
        localStorage.setItem("shopease_users", JSON.stringify(registeredUsers));

        setSuccessMessage("Account created successfully! Redirecting to login page...");
        
        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } catch {
        setApiError("An error occurred during registration. Please try again.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleGoogleSignup = () => {
    setApiError("Google Sign-Up is simulated. Please use the Google sign-in option on the Login page.");
  };

  return (
    <form className="auth-form" onSubmit={handleRegister} noValidate>
      <h2>Create Account 🚀</h2>
      <p>Create your ShopEase account and start shopping.</p>

      {apiError && (
        <div className="auth-alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      {successMessage && (
        <div className="auth-alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      <div className={`input-group ${errors.fullName ? "has-error" : ""}`} style={{ marginBottom: "16px" }}>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
        />
        {errors.fullName && <div className="form-field-error">⚠️ {errors.fullName}</div>}
      </div>

      <div className={`input-group ${errors.email ? "has-error" : ""}`} style={{ marginBottom: "16px" }}>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        {errors.email && <div className="form-field-error">⚠️ {errors.email}</div>}
      </div>

      <div className={`input-group ${errors.mobile ? "has-error" : ""}`} style={{ marginBottom: "16px" }}>
        <label>Mobile Number</label>
        <input
          type="text"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          disabled={isLoading}
        />
        {errors.mobile && <div className="form-field-error">⚠️ {errors.mobile}</div>}
      </div>

      <div className={`input-group ${errors.password ? "has-error" : ""}`} style={{ marginBottom: "16px" }}>
        <label>Password</label>
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        {errors.password && <div className="form-field-error">⚠️ {errors.password}</div>}
      </div>

      <div className={`input-group ${errors.confirmPassword ? "has-error" : ""}`} style={{ marginBottom: "16px" }}>
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
        {errors.confirmPassword && <div className="form-field-error">⚠️ {errors.confirmPassword}</div>}
      </div>

      <div className="terms-row" style={{ margin: "16px 0", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            disabled={isLoading}
          />
          I agree to the Terms & Conditions
        </label>
        {errors.agreeTerms && <div className="form-field-error" style={{ marginTop: "4px" }}>⚠️ {errors.agreeTerms}</div>}
      </div>

      <button
        type="submit"
        className={`login-btn ${isLoading ? "btn-loading" : ""}`}
        disabled={isLoading}
        style={{ width: "100%", height: "52px", borderRadius: "12px", border: "none", background: "#7c3aed", color: "white", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}
      >
        Create Account
      </button>

      <div className="divider">OR</div>

      <button
        type="button"
        className="google-btn"
        onClick={handleGoogleSignup}
        disabled={isLoading}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", height: "52px", border: "1px solid #d1d5db", borderRadius: "12px", background: "white", cursor: "pointer", fontWeight: "600", color: "#475569" }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: "4px" }}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign Up with Google
      </button>

      <div className="register-link" style={{ marginTop: "25px", textAlign: "center", fontSize: "14.5px" }}>
        Already have an account?
        <Link to="/login" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: "600", marginLeft: "6px" }}>Sign In</Link>
      </div>
    </form>
  );
}

export default RegisterForm;
