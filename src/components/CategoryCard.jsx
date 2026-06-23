import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.name}`} className="category-card">
      <div className="category-image">
        <img src={category.image} alt={category.name} />
      </div>

      <div className="category-content">
        <h3>{category.name}</h3>

        <span>View Collection →</span>
      </div>
    </Link>
  );
}

export default CategoryCard;
