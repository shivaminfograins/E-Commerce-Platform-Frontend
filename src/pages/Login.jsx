import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

function Login({ user, setUser }) {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Continue your shopping journey with ShopEase."
    >
      <LoginForm user={user} setUser={setUser} />
    </AuthLayout>
  );
}

export default Login;
