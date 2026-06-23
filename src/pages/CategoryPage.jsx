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

import MainLayout from "../layouts/MainLayout";

import categories from "../data/categories";

import CategoryCard from "../components/CategoryCard";

function CategoryPage({ cart = {} }) {
  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  return (
    <MainLayout cartCount={cartCount}>
      <div className="container">
        <div className="page-heading">
          <h1>Shop By Category</h1>

          <p>Browse products by category</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default CategoryPage;
