function ProductFilters({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}) {
  return (
    <aside className="products-sidebar">
      <h3>Search</h3>

      <input
        type="text"
        placeholder="Search Products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Price</h3>

      <label>
        <input
          type="radio"
          checked={priceRange === "All"}
          onChange={() => setPriceRange("All")}
        />
        All
      </label>

      <label>
        <input
          type="radio"
          checked={priceRange === "under10k"}
          onChange={() => setPriceRange("under10k")}
        />
        Under ₹10,000
      </label>

      <label>
        <input
          type="radio"
          checked={priceRange === "10kto50k"}
          onChange={() => setPriceRange("10kto50k")}
        />
        ₹10,000 - ₹50,000
      </label>

      <label>
        <input
          type="radio"
          checked={priceRange === "above50k"}
          onChange={() => setPriceRange("above50k")}
        />
        Above ₹50,000
      </label>

      <h3>Categories</h3>

      {categories.map((category) => (
        <button
          key={category.id}
          className={
            selectedCategory?.id === category.id ? "active-filter" : ""
          }
          onClick={() => setSelectedCategory(category)}
        >
          {category.name}
        </button>
      ))}
    </aside>
  );
}

export default ProductFilters;
