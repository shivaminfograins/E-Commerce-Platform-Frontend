function Categories({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <section>
      <h2>Shop By Category</h2>

      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? "active-category" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;
