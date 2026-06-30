import AuthLayout from "../layouts/AuthLayout";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

function ResetPassword() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Choose a strong, secure new password."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}

export default ResetPassword;
