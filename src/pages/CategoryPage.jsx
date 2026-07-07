// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import products from "../data/products";
// import ProductList from "../components/ProductList";

// function CategoryPage({ cart = {}, setCart }) {
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [wishlist, setWishlist] = useState(new Set());

//   const categories = [
//     "All",
//     "Mobiles",
//     "Laptops",
//     "Accessories",
//     "Fashion",
//     "Shoes",
//   ];

//   const filteredProducts =
//     selectedCategory === "All"
//       ? products
//       : products.filter((product) => product.category === selectedCategory);

//   const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

//   const handleAddToCart = (productId) => {
//     setCart((prev) => ({
//       ...prev,
//       [productId]: (prev[productId] || 0) + 1,
//     }));
//   };

//   const handleRemoveFromCart = (productId) => {
//     setCart((prev) => {
//       const updated = { ...prev };
//       if (updated[productId] > 1) {
//         updated[productId] -= 1;
//       } else {
//         delete updated[productId];
//       }
//       return updated;
//     });
//   };

//   const handleToggleWishlist = (productId) => {
//     setWishlist((prev) => {
//       const updated = new Set(prev);
//       if (updated.has(productId)) {
//         updated.delete(productId);
//       } else {
//         updated.add(productId);
//       }
//       return updated;
//     });
//   };

//   const productsWithMeta = filteredProducts.map((product) => ({
//     ...product,
//     qty: cart[product.id] || 0,
//     isWishlisted: wishlist.has(product.id),
//   }));

//   return (
//     <>
//       <Navbar cartCount={cartCount} search="" setSearch={() => {}} onCartClick={() => navigate("/cart")} />

//       <div className="container">
//         <h1>Shop By Category</h1>

//         <div className="categories">
//           {categories.map((category) => (
//             <button
//               key={category}
//               className={
//                 selectedCategory === category
//                   ? "category-btn active-category"
//                   : "category-btn"
//               }
//               onClick={() => setSelectedCategory(category)}
//             >
//               {category}
//             </button>
//           ))}
//         </div>

//         <ProductList
//           products={productsWithMeta}
//           onAdd={handleAddToCart}
//           onRemove={handleRemoveFromCart}
//           onToggleWishlist={handleToggleWishlist}
//         />
//       </div>

//       <Footer />
//     </>
//   );
// }

// export default CategoryPage;

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CategoryCard from "../components/CategoryCard";
import { useCategories } from "../hooks/useCategories";
import localCategories from "../data/categories";

// Vite proxy only handles /api/*; /media/* must go directly to Django.
const BACKEND_ORIGIN =
  import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

function normalizeMediaUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return BACKEND_ORIGIN + url;
  return url;
}
function CategoryPage({ cart = {}, wishlist = [], user, setUser }) {
  const navigate = useNavigate();
  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  const {
    categories: apiCategories,
    loading: loadingCategories,
    error: categoryError,
  } = useCategories();

  const categories = useMemo(() => {
    return (apiCategories || []).map((category) => {
      const localCategory = localCategories.find(
        (item) =>
          item.id === category.id ||
          item.name.toLowerCase() === category.name.toLowerCase(),
      );

      // API returns images as an array: [{ image: "/media/categories/foo.png" }]
      const apiImagePath =
        category?.images?.[0]?.image ||
        category?.images?.[0]?.url ||
        null;

      const image =
        normalizeMediaUrl(apiImagePath) ||
        localCategory?.image ||
        "/images/categories/default.png";

      const slug =
        category.slug ||
        category.name?.toLowerCase().replace(/\s+/g, "-") ||
        "";

      return {
        ...category,
        image,
        name: category.name,
        slug,
      };
    });
  }, [apiCategories]);

  return (
    <MainLayout
      cartCount={cartCount}
      wishlistCount={wishlist.length}
      user={user}
      setUser={setUser}
    >
      <div className="container">
        <div className="page-heading">
          <h1>Shop By Category</h1>
          <p>Browse products by category</p>
        </div>

        {loadingCategories && (
          <p className="section-message">Loading categories...</p>
        )}
        {categoryError && (
          <p className="section-message section-message--error">
            {categoryError}
          </p>
        )}

        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => navigate(`/category/${category.slug}`)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default CategoryPage;
