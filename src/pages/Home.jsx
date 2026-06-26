import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductList from "../components/ProductList";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import CartModal from "../components/CartModal";
import { useProducts } from "../hooks/useProducts";
import PromotionBanner from "../components/PromotionBanner";

// import services
import categoryService from "../services/categoryService";

function Home({
  cart = {},
  setCart,
  wishlist = [],
  setWishlist,
  user,
  setUser,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    name: "All",
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [categories, setCategories] = useState([{ id: 0, name: "All" }]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const {
    products,
    loading: loadingProducts,
    error: productError,
  } = useProducts(selectedCategory.id);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // const categories = [
  //   "All",
  //   "Mobiles",
  //   "Laptops",
  //   "Accessories",
  //   "Fashion",
  //   "Shoes",
  // ];
  // fetch categories from the API when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const data = await categoryService.getCategories();
      let myCategories = data.map((category) => ({
        id: category.id,
        name: category.name,
      }));
      console.log("Fetched Categories:", myCategories); // Debugging line
      // Add "All" option at the beginning
      setCategories([{ id: 0, name: "All" }, ...myCategories]);
    } catch (error) {
      console.error(error);
      setCategoryError("Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddToCart = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const searchFilteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const cartItems = products
    .filter((product) => cart[product.id])
    .map((product) => ({
      ...product,
      quantity: cart[product.id],
    }));

  const productsWithMeta = searchFilteredProducts.map((product) => ({
    ...product,
    qty: cart[product.id] || 0,
    isWishlisted: wishlist.includes(product.id),
  }));

  const latestProducts = [...productsWithMeta]
    .sort((a, b) => b.id - a.id)
    .slice(0, 8);

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        search={search}
        setSearch={setSearch}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => navigate("/wishlist")}
        user={user}
        setUser={setUser}
      />

      <main className="container">
        <Hero />

        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {loadingProducts && (
          <p className="section-message">Loading products...</p>
        )}
        {productError && (
          <p className="section-message section-message--error">
            {productError}
          </p>
        )}

        <ProductList
          products={latestProducts}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCart}
          onToggleWishlist={handleToggleWishlist}
          showViewAll={true}
        />

        <PromotionBanner />

        <Newsletter />
        <CartModal
          isOpen={isCartOpen}
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCart}
        />
      </main>

      <Footer />
    </>
  );
}

export default Home;
