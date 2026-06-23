import ProductCard from "./ProductCard";

function RelatedProducts({ products, currentProductId, cart = {}, onAdd, onRemove }) {
  const relatedProducts = products
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
