import { useEffect, useState } from "react";
import { productService } from "../services/productService";

export function useProducts(categoryId, page = 1) {
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
        const params = { page };
        if (categoryId && categoryId !== 0) {
          params.category = categoryId;
        }

        const data = await productService.getProducts(params);
        const items =
          Array.isArray(data) && data.length
            ? data
            : data.results || data.products || [];

        const normalizedProducts = items.map((product) => {
          const rawImage =
            product.images?.[0]?.image || product.images?.[0]?.url || "";
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
          const imageUrl = normalizeUrl(rawImage);
          const firstVariant = product.variants?.[0] || {};
          const price = firstVariant.price ? Number(firstVariant.price) : 0;

          return {
            id: product.id,
            name: product.name,
            brand: product.brand || "",
            image: imageUrl,
            price,
            originalPrice: price,
            discountPercent: 0,
            rating: product.rating || 4.5,
            reviewsCount: product.reviewsCount || 0,
            badge: product.badge || "",
            category: product.category,
            description: product.description,
          };
        });

        setProducts(normalizedProducts);
        setTotalCount(data.count || normalizedProducts.length);
        setNext(data.next || null);
        setPrevious(data.previous || null);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, page]);

  return {
    products,
    totalCount,
    next,
    previous,
    loading,
    error,
  };
}
