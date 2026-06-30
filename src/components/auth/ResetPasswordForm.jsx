import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../../services/authService";

function ResetPasswordForm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      await authService.resetPassword({
        uid,
        token,
        password,
        confirm_password: confirmPassword
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.error ||
        "Failed to reset password. The link may have expired or is invalid.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-form">
        <div className="success-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "60px", height: "60px", background: "#dcfce7", color: "#16a34a", borderRadius: "50%", fontSize: "28px", fontWeight: "bold", margin: "0 auto 20px" }}>✓</div>

        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Password Reset Complete</h2>

        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "24px", fontSize: "14px" }}>
          Your password has been reset successfully. Redirecting you to login page...
        </p>

        <Link to="/login" className="login-btn" style={{ textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Reset Password</h2>

      <p>Enter your new password below.</p>

      {error && (
        <div className="auth-alert-error" style={{ display: "flex", gap: "8px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px" }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="input-group" style={{ marginBottom: "20px" }}>
        <label>New Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{ paddingRight: "40px", width: "100%", height: "45px", boxSizing: "border-box" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
            }}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="input-group" style={{ marginBottom: "25px" }}>
        <label>Confirm New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          style={{ width: "100%", height: "45px", boxSizing: "border-box" }}
        />
      </div>

      <button type="submit" className="login-btn" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      <div className="register-link">
        <Link to="/login">Back To Login</Link>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
