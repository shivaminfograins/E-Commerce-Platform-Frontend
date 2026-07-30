import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { productService } from "../services/productService";
import cartService from "../services/cartService";

import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ProductFeatures from "../components/ProductFeatures";
import ProductDescription from "../components/ProductDescription";
import RelatedProducts from "../components/RelatedProducts";
import ReviewSection from "../components/reviews/ReviewSection";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";

/**
 * ProductDetails.jsx
 *
 * Changes from previous version:
 *  - Stores the full `variants` array on normalized product data.
 *  - Adds `selectedVariant` state (null until user picks one).
 *  - handleAddToCart / handleBuyNow call cartService.addToCart({ variant, quantity })
 *    instead of calling setCart with a product id.
 *  - Passes variants + selectedVariant + onSelectVariant down to ProductInfo.
 *  - Cart count is derived from cartItems (passed from App) rather than
 *    the local `cart` map, so the Navbar badge is always accurate.
 */
function ProductDetails({
  cart = {},
  setCart,
  cartItems = [],
  wishlist = [],
  user,
  setUser,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const autoOpenReview = queryParams.get("writeReview") === "true";

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(""); // "" | "success" | "error"

  // Derive cart count from the live cartItems array (variant-aware)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const normalizeUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return url; // relative /media/... paths work via the Vite proxy
  };

  // ── Data fetching ──────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setSelectedVariant(null);
      setQuantity(1);
      setCartFeedback("");

      try {
        const data = await productService.getProduct(id);

        // Prefer variant primary image, then first variant image, then top-level product.images
        let rawImage = null;
        if (Array.isArray(data.variants) && data.variants.length > 0) {
          for (const variant of data.variants) {
            const primary = variant.images?.find((img) => img.is_primary);
            if (primary?.image) {
              rawImage = primary.image;
              break;
            }
          }

          if (!rawImage) {
            for (const variant of data.variants) {
              if (variant.images && variant.images.length > 0) {
                rawImage = variant.images[0].image || variant.images[0].url;
                break;
              }
            }
          }
        }

        if (!rawImage && Array.isArray(data.images) && data.images.length) {
          rawImage = data.images[0].image || data.images[0].url || null;
        }

        const imageUrl = normalizeUrl(rawImage) || null;

        // Keep the raw variants so ProductInfo can render the selector
        const rawVariants = Array.isArray(data.variants) ? data.variants : [];
        setVariants(rawVariants);

        const normalizedProduct = {
          id: data.id,
          name: data.name,
          brand: data.brand || "ShopEase",
          category: data.category,
          // Show first variant price as the "from" price; updates when user selects
          price: Number(rawVariants[0]?.price || 0),
          originalPrice: Number(rawVariants[0]?.price || 0),
          discountPercent: 0,
          rating: data.rating || 4.5,
          reviewsCount: data.reviewsCount || 0,
          image: imageUrl,
          description: data.description,
          badge: data.badge || "",
        };

        setProduct(normalizedProduct);

        // Related products
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
            // prefer variant primary image, then first variant image, then top-level images
            let rawImg = null;
            if (Array.isArray(item.variants) && item.variants.length > 0) {
              for (const variant of item.variants) {
                const primary = variant.images?.find((img) => img.is_primary);
                if (primary?.image) {
                  rawImg = primary.image;
                  break;
                }
              }

              if (!rawImg) {
                for (const variant of item.variants) {
                  if (variant.images && variant.images.length > 0) {
                    rawImg = variant.images[0].image || variant.images[0].url;
                    break;
                  }
                }
              }
            }

            if (!rawImg && Array.isArray(item.images) && item.images.length) {
              rawImg = item.images[0].image || item.images[0].url || null;
            }

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
              image: normalizeUrl(rawImg),
              badge: item.badge || "",
              variants: item.variants || [],
            };
          });

        setRelatedProducts(normalizedRelated);
      } catch {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ── Loading / error states ─────────────────────────────────
  const navbarProps = {
    cartCount,
    wishlistCount: wishlist.length,
    search: "",
    setSearch: () => { },
    onCartClick: () => navigate("/cart"),
    onWishlistClick: () => navigate("/wishlist"),
    user,
    setUser,
  };

  if (loading) {
    return (
      <>
        <Navbar {...navbarProps} />
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
        <Navbar {...navbarProps} />
        <div className="container">
          <h2>{error || "Product Not Found"}</h2>
        </div>
        <Footer />
      </>
    );
  }

  // ── Handlers ───────────────────────────────────────────────
  const activeVariant = selectedVariant || variants[0] || null;

  const handleIncrease = () => {
    if (!activeVariant) return;
    setQuantity((q) => Math.min(q + 1, activeVariant.stock));
  };

  const handleDecrease = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
    // Clamp quantity if current quantity exceeds new variant's stock
    setQuantity((q) => Math.min(q, variant.stock || 1));
    setCartFeedback("");
  };

  /**
   * Add the selected variant to the cart via the API.
   * On success, App.jsx's updateCartStateFromBackend refreshes cartItems.
   */
  const handleAddToCart = async () => {
    if (!activeVariant || addingToCart) return;
    setAddingToCart(true);
    setCartFeedback("");
    try {
      const response = await cartService.addToCart(
        activeVariant.id,
        quantity,
      );
      // Propagate backend state to App so Navbar badge + Cart page update
      setCart(response.data);
      setQuantity(1);
      setCartFeedback("success");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Could not add to cart. Please try again.";
      setCartFeedback(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!activeVariant || addingToCart) return;
    await handleAddToCart();
    navigate("/cart");
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      <Navbar {...navbarProps} />

      <Breadcrumbs productName={product?.name} />

      <div className="container">
        <div className="product-details-layout">
          <ProductGallery
            product={product}
            variants={variants}
            selectedVariant={selectedVariant}
          />

          <div>
            <ProductInfo
              product={product}
              variants={variants}
              selectedVariant={selectedVariant}
              onSelectVariant={handleSelectVariant}
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />

            {/* Cart action feedback */}
            {cartFeedback === "success" && (
              <div className="cart-feedback cart-feedback--success">
                ✓ Added to cart successfully!
              </div>
            )}
            {cartFeedback && cartFeedback !== "success" && (
              <div className="cart-feedback cart-feedback--error">
                ✕ {cartFeedback}
              </div>
            )}

            <ProductFeatures />
          </div>
        </div>

        <ProductDescription product={product} />

        <RelatedProducts
          products={relatedProducts}
          currentProductId={product.id}
          cart={cart}
          onAdd={() => { }}
          onRemove={() => { }}
        />

        <ReviewSection productId={product.id} user={user} autoOpenReview={autoOpenReview} />
      </div>

      <Footer />
    </>
  );
}

export default ProductDetails;
