function Categories({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <section className="home-categories-section">
      <h2 className="home-categories-title">Shop By Category</h2>

      <div className="home-categories-grid">
        {categories.map((category) => {
          const isActive = selectedCategory?.id === category.id;
          return (
            <div
              key={category.id}
              className={`home-category-card ${isActive ? "home-active-card" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="home-category-card__img-wrapper">
                <img
                  src={category.image}
                  alt={category.name}
                  className="home-category-card__img"
                />
                <div className="home-category-card__overlay" />
                <div className="home-category-card__content">
                  <span className="home-category-card__name">{category.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Categories;
