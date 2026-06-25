import AuthBanner from "../components/auth/AuthBanner";
import { Link } from "react-router-dom";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-layout" style={{ position: "relative" }}>
      {/* Floating Close Button */}
      <Link to="/" className="auth-close-btn" aria-label="Close">
        ✕
      </Link>

      <div className="auth-left">
        <AuthBanner title={title} subtitle={subtitle} />
      </div>

      <div className="auth-right">{children}</div>
    </div>
  );
}

export default AuthLayout;
