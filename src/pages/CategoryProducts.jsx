import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductList from "../components/ProductList";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

function CategoryProducts({
  cart = {},
  setCart,
  wishlist = [],
  setWishlist,
  user,
  setUser,
}) {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const {
    categories: apiCategories,
    loading: loadingCategories,
    error: categoryError,
  } = useCategories();

  const selectedCategory = useMemo(() => {
    if (!apiCategories) return null;
    const normalizedCategoryName = categoryName?.toLowerCase() || "";
    if (normalizedCategoryName === "all") return null;

    return apiCategories.find(
      (category) =>
        category.slug?.toLowerCase() === normalizedCategoryName ||
        category.name?.toLowerCase() === normalizedCategoryName,
    );
  }, [apiCategories, categoryName]);

  const {
    products,
    totalCount,
    loading: loadingProducts,
    error: productError,
  } = useProducts(selectedCategory?.id || 0);

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
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const productsWithMeta = products.map((product) => ({
    ...product,
    qty: cart[product.id] || 0,
    isWishlisted: wishlist.includes(product.id),
  }));

  const title = selectedCategory ? selectedCategory.name : categoryName;

  return (
    <MainLayout
      cartCount={cartCount}
      wishlistCount={wishlist.length}
      user={user}
      setUser={setUser}
    >
      <div className="container">
        <div className="page-heading">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/categories")}
          >
            ← Back to Categories
          </button>
          <h1 style={{ textTransform: "capitalize" }}>{title}</h1>
          <p>{totalCount} Products</p>
        </div>

        {loadingCategories && (
          <p className="section-message">Loading category...</p>
        )}
        {categoryError && (
          <p className="section-message section-message--error">
            {categoryError}
          </p>
        )}
        {!loadingCategories && !selectedCategory && (
          <p className="section-message section-message--error">
            Category not found.
          </p>
        )}

        {!loadingCategories && selectedCategory && (
          <>
            {loadingProducts && (
              <p className="section-message">Loading products...</p>
            )}
            {productError && (
              <p className="section-message section-message--error">
                {productError}
              </p>
            )}

            {!loadingProducts && !productError && (
              <ProductList
                products={productsWithMeta}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
                onToggleWishlist={handleToggleWishlist}
              />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default CategoryProducts;
