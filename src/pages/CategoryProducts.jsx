import { useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import products from "../data/products";

import ProductList from "../components/ProductList";

function CategoryProducts({ cart = {}, setCart }) {
  const { categoryName } = useParams();
  const [wishlist, setWishlist] = useState(new Set());

  const categoryProducts = products.filter(
    (item) => item.category.toLowerCase() === categoryName.toLowerCase(),
  );

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

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
      const updated = new Set(prev);
      if (updated.has(productId)) {
        updated.delete(productId);
      } else {
        updated.add(productId);
      }
      return updated;
    });
  };

  const productsWithMeta = categoryProducts.map((product) => ({
    ...product,
    qty: cart[product.id] || 0,
    isWishlisted: wishlist.has(product.id),
  }));

  return (
    <MainLayout cartCount={cartCount}>
      <div className="container">
        <div className="page-heading">
          <h1 style={{ textTransform: "capitalize" }}>{categoryName}</h1>

          <p>{categoryProducts.length} Products</p>
        </div>

        <ProductList
          products={productsWithMeta}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCart}
          onToggleWishlist={handleToggleWishlist}
        />
      </div>
    </MainLayout>
  );
}

export default CategoryProducts;
