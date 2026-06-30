import { Link } from "react-router-dom";
import { useState } from "react";
import authService from "../../services/authService";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword({ email: email.trim() });
      setSuccess(true);
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.error ||
        "Failed to send reset link. Please check the email and try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-form">
        <div className="success-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "60px", height: "60px", background: "#dcfce7", color: "#16a34a", borderRadius: "50%", fontSize: "28px", fontWeight: "bold", margin: "0 auto 20px" }}>✓</div>

        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Check Your Email</h2>

        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "24px", fontSize: "14px" }}>We've sent a password reset link to your email address.</p>

        <Link to="/login" className="login-btn" style={{ textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
          Back To Login
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Forgot Password?</h2>

      <p>Enter your email address to receive a reset link.</p>

      {error && (
        <div className="auth-alert-error" style={{ display: "flex", gap: "8px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px" }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="input-group">
        <label>Email Address</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button type="submit" className="login-btn" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
        {isLoading ? "Sending Link..." : "Send Reset Link"}
      </button>

      <div className="register-link">
        <Link to="/login">Back To Login</Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
