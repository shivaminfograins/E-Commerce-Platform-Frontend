import AuthLayout from "../layouts/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Recover your account securely."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

export default ForgotPassword;
