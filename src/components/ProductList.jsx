import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function ProductList({ products, onAdd, onRemove, onToggleWishlist, showViewAll = false }) {
  return (
    <section>
      <div className="section-header">
        <h2>Featured Products</h2>

        {showViewAll ? (
          <Link to="/products" className="view-all-link">
            View All →
          </Link>
        ) : (
          <span>{products.length} Products</span>
        )}
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAdd={onAdd}
            onRemove={onRemove}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductList;
