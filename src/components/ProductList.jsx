import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function ProductList({
  products,
  onAdd,
  onRemove,
  onToggleWishlist,
  showViewAll = false,
  title = "Featured Products",
}) {
  return (
    <section>
      <div className="section-header">
        <h2>{title}</h2>

        {showViewAll ? (
          <Link to="/products" className="view-all-link">
            View All →
          </Link>
        ) : (
          <span>{products.length} Products</span>
        )}
      </div>

      <div className="products-grid">
        {products.map((product) => {
          // If caller already normalized an `image` field, prefer it.
          let imageUrl = product?.image ?? null;

          // Otherwise prefer image flagged as primary in variants, otherwise first available image
          if (!imageUrl && product?.variants && product.variants.length > 0) {
            // search for primary image across variants
            for (const variant of product.variants) {
              const primary = variant.images?.find((img) => img.is_primary);
              if (primary?.image) {
                imageUrl = primary.image;
                break;
              }
            }

            // fallback to first image of first variant
            if (!imageUrl) {
              for (const variant of product.variants) {
                if (variant.images && variant.images.length > 0) {
                  imageUrl = variant.images[0].image;
                  break;
                }
              }
            }
          }

          return (
            <ProductCard
              key={product.id}
              {...product}
              image={imageUrl}
              onAdd={onAdd}
              onRemove={onRemove}
              onToggleWishlist={onToggleWishlist}
            />
          );
        })}
      </div>
    </section>
  );
}

export default ProductList;
