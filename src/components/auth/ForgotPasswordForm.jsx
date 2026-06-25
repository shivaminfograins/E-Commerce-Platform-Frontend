import { Link } from "react-router-dom";
import { useState } from "react";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Static UI only
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="auth-form">
        <div className="success-icon">✓</div>

        <h2>Check Your Email</h2>

        <p>We've sent a password reset link to your email address.</p>

        <Link to="/login" className="login-btn">
          Back To Login
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Forgot Password?</h2>

      <p>Enter your email address to receive a reset link.</p>

      <div className="input-group">
        <label>Email Address</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button type="submit" className="login-btn">
        Send Reset Link
      </button>

      <div className="register-link">
        <Link to="/login">Back To Login</Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
