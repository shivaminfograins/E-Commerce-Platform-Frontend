import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductList from "../components/ProductList";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import CartModal from "../components/CartModal";
import products from "../data/products";
import PromotionBanner from "../components/PromotionBanner";


function Home({ cart = {}, setCart, wishlist = [], setWishlist, user, setUser }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const categories = ["All", "Mobiles", "Laptops", "Accessories", "Fashion", "Shoes"];

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

  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  const cartItems = products
    .filter((product) => cart[product.id])
    .map((product) => ({
      ...product,
      quantity: cart[product.id],
    }));

  const productsWithMeta = filteredProducts.map((product) => ({
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
