import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function MainLayout({
  children,
  cartCount = 0,
  wishlistCount = 0,
  search = "",
  setSearch = () => {},
  user = null,
  setUser = () => {},
}) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        search={search}
        setSearch={setSearch}
        onCartClick={() => navigate("/cart")}
        onWishlistClick={() => navigate("/wishlist")}
        user={user}
        setUser={setUser}
      />

      {children}

      <Footer />
    </>
  );
}

export default MainLayout;
