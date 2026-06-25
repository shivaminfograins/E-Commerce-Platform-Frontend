import AuthLayout from "../layouts/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

function Register({ user, setUser }) {
  return (
    <AuthLayout
      title="Join ShopEase"
      subtitle="Create an account and discover amazing deals every day."
    >
      <RegisterForm user={user} setUser={setUser} />
    </AuthLayout>
  );
}

export default Register;
