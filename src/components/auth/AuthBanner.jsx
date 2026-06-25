function AuthBanner({ title, subtitle }) {
  return (
    <div className="auth-banner">
      <div className="overlay">
        <h1>ShopEase</h1>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

export default AuthBanner;
