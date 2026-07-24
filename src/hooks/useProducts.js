import { useEffect, useState } from "react";
import { productService } from "../services/productService";

const PAGE_SIZE = 12;
const PRICE_FILTER_PAGE_SIZE = 1000;

const applyPriceFilterParams = (params, min, max) => {
  if (min !== undefined && min !== null) {
    params.min_price = min;
    params.price_min = min;
    params["price__gte"] = min;
  }
  if (max !== undefined && max !== null) {
    params.max_price = max;
    params.price_max = max;
    params["price__lte"] = max;
  }
};

export function useProducts(
  categoryId,
  brandId = 0,
  page = 1,
  priceRange = "All",
) {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const isPriceFiltered = priceRange !== "All";
        const pageSize = isPriceFiltered ? PRICE_FILTER_PAGE_SIZE : PAGE_SIZE;
        const params = {
          page,
          page_size: pageSize,
        };
        if (categoryId && categoryId !== 0) {
          params.category = categoryId;
        }
        if (brandId && brandId !== 0) {
          params.brand = brandId;
        }

        if (priceRange === "under10k") {
          applyPriceFilterParams(params, 0, 9999);
        } else if (priceRange === "10kto50k") {
          applyPriceFilterParams(params, 10000, 50000);
        } else if (priceRange === "above50k") {
          applyPriceFilterParams(params, 50001, undefined);
        }

        const data = await productService.getProducts(params);
        const items =
          Array.isArray(data) && data.length
            ? data
            : data.results || data.products || [];

        const normalizedProducts = items.map((product) => {
          // Prefer variant images (primary) if available, otherwise first available
          let rawImage = null;
          if (Array.isArray(product.variants) && product.variants.length > 0) {
            for (const variant of product.variants) {
              const primary = variant.images?.find((img) => img.is_primary);
              if (primary?.image) {
                rawImage = primary.image;
                break;
              }
            }

            if (!rawImage) {
              for (const variant of product.variants) {
                if (variant.images && variant.images.length > 0) {
                  rawImage = variant.images[0].image || variant.images[0].url;
                  break;
                }
              }
            }
          }

          // also allow top-level product.images as a fallback (older API shape)
          if (
            !rawImage &&
            Array.isArray(product.images) &&
            product.images.length
          )
            rawImage = product.images[0].image || product.images[0].url || null;

          // /media/* is proxied through Vite to Django; absolute URLs pass through.
          const normalizeUrl = (url) => {
            if (!url || typeof url !== "string") return null;
            if (url.startsWith("http://") || url.startsWith("https://"))
              return url;
            return url;
          };
          const imageUrl = normalizeUrl(rawImage);

          const variantPrices = Array.isArray(product.variants)
            ? product.variants
                .map((variant) => Number(variant.price || 0))
                .filter((value) => Number.isFinite(value) && value > 0)
            : [];
          const minPrice = variantPrices.length
            ? Math.min(...variantPrices)
            : 0;
          const maxPrice = variantPrices.length
            ? Math.max(...variantPrices)
            : 0;
          const price = minPrice || maxPrice || 0;

          return {
            id: product.id,
            name: product.name,
            brand: product.brand || "",
            image: imageUrl,
            variants: product.variants || [],
            price,
            originalPrice: price,
            minPrice,
            maxPrice,
            discountPercent: 0,
            rating: product.rating || 4.5,
            reviewsCount: product.reviewsCount || 0,
            badge: product.badge || "",
            category: product.category,
            description: product.description,
          };
        });

        setProducts(normalizedProducts);
        const count = data.count ?? normalizedProducts.length;
        setTotalCount(count);
        setNext(
          data.next ||
            (Number.isFinite(count) ? page * pageSize < count : null),
        );
        setPrevious(page > 1 ? page - 1 : null);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, brandId, page, priceRange]);

  return {
    products,
    totalCount,
    next,
    previous,
    loading,
    error,
  };
}
