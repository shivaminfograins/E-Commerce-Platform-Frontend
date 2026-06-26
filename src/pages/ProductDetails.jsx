import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { productService } from "../services/productService";

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
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cartCount = Object.values(cart).reduce((sum, val) => sum + val, 0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProduct(id);
        const normalizeUrl = (url) => {
          if (!url) return "";
          if (typeof url !== "string") return "";
          if (url.startsWith("http://") || url.startsWith("https://"))
            return url;
          if (url.startsWith("/")) {
            const apiBase = import.meta.env.VITE_API_BASE_URL || "";
            const backendOrigin = apiBase.replace(/\/api\/?$/, "");
            return backendOrigin + url;
          }
          return url;
        };

        const imageUrl = normalizeUrl(
          data.images?.[0]?.image || data.images?.[0]?.url || "",
        );

        const normalizedProduct = {
          id: data.id,
          name: data.name,
          brand: data.brand || "ShopEase",
          category: data.category,
          price: Number(data.variants?.[0]?.price || 0),
          originalPrice: Number(data.variants?.[0]?.price || 0),
          discountPercent: 0,
          rating: data.rating || 4.5,
          reviewsCount: data.reviewsCount || 0,
          image: imageUrl,
          description: data.description,
          badge: data.badge || "",
        };

        setProduct(normalizedProduct);

        const categoryProductsResponse = await productService.getProducts({
          category: data.category,
          page: 1,
        });

        const relatedItems =
          Array.isArray(categoryProductsResponse) &&
          categoryProductsResponse.length
            ? categoryProductsResponse
            : categoryProductsResponse.results ||
              categoryProductsResponse.products ||
              [];

        const normalizedRelated = relatedItems
          .filter((item) => item.id !== data.id)
          .slice(0, 4)
          .map((item) => {
            const rawRelatedImage =
              item.images?.[0]?.image || item.images?.[0]?.url || "";
            return {
              id: item.id,
              name: item.name,
              brand: item.brand || "ShopEase",
              category: item.category,
              price: Number(item.variants?.[0]?.price || 0),
              originalPrice: Number(item.variants?.[0]?.price || 0),
              discountPercent: 0,
              rating: item.rating || 4.5,
              reviewsCount: item.reviewsCount || 0,
              image: normalizeUrl(rawRelatedImage),
              badge: item.badge || "",
            };
          });

        setRelatedProducts(normalizedRelated);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
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
          <p className="section-message">Loading product details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
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
          <h2>{error || "Product Not Found"}</h2>
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
          products={relatedProducts}
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
