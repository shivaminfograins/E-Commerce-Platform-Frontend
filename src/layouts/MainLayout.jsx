import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function MainLayout({
  children,
  cartCount = 0,
  search = "",
  setSearch = () => {},
}) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        cartCount={cartCount}
        search={search}
        setSearch={setSearch}
        onCartClick={() => navigate("/cart")}
      />

      {children}

      <Footer />
    </>
  );
}

export default MainLayout;
