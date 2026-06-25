import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import products from "../data/products";

import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ProductFeatures from "../components/ProductFeatures";
import ProductDescription from "../components/ProductDescription";
import RelatedProducts from "../components/RelatedProducts";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ProductDetails({ cart = {}, setCart, wishlist = [], user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((item) => item.id === Number(id));

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  if (!product) {
    return (
      <>
        <Navbar
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          search=""
          setSearch={() => {}}
          onCartClick={() => navigate("/cart")}
          onWishlistClick={() => navigate("/wishlist")}
          user={user}
          setUser={setUser}
        />
        <div className="container">
          <h2>Product Not Found</h2>
        </div>
        <Footer />
      </>
    );
  }

  const handleIncrease = () => {
    setQuantity((q) => q + 1);
  };

  const handleDecrease = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleAddToCart = () => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + quantity,
    }));
    // Reset selection quantity back to 1 after adding to cart
    setQuantity(1);
  };

  const handleBuyNow = () => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + quantity,
    }));
    navigate("/cart");
  };

  const handleAddRelated = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemoveRelated = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        search=""
        setSearch={() => {}}
        onCartClick={() => navigate("/cart")}
        onWishlistClick={() => navigate("/wishlist")}
        user={user}
        setUser={setUser}
      />

      <div className="container">
        <div className="product-details-layout">
          <ProductGallery product={product} />

          <div>
            <ProductInfo
              product={product}
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />

            <ProductFeatures />
          </div>
        </div>

        <ProductDescription product={product} />

        <RelatedProducts
          products={products}
          currentProductId={product.id}
          cart={cart}
          onAdd={handleAddRelated}
          onRemove={handleRemoveRelated}
        />
      </div>

      <Footer />
    </>
  );
}

export default ProductDetails;
