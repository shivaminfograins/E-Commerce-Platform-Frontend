function ProductSort({ sortBy, setSortBy }) {
  return (
    <div className="product-sort">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="latest">Latest</option>

        <option value="low">Price Low To High</option>

        <option value="high">Price High To Low</option>
      </select>
    </div>
  );
}

export default ProductSort;
