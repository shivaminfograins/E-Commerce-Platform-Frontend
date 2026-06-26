function Categories({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <section>
      <h2>Shop By Category</h2>

      <div className="categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${
              selectedCategory?.id === category.id ? "active-category" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;
