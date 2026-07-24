import ProductCard from "./ProductCard";
import defaultProducts from "../data/products";

function RelatedProducts({
  products = [],
  currentProductId,
  cart = {},
  onAdd,
  onRemove,
}) {
  // Use provided related products when available; otherwise fall back to default catalog
  const source =
    Array.isArray(products) && products.length ? products : defaultProducts;

  const relatedProducts = source
    .filter((item) => item.id !== currentProductId)
    .slice(0, 4);

  return (
    <section className="related-products">
      <h2>You May Also Like</h2>

      <div className="products-grid">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            qty={cart[product.id] || 0}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
