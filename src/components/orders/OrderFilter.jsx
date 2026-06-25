function OrderFilter({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }) {
  return (
    <div className="order-filter">
      <input
        type="text"
        placeholder="Search by product name, brand, or order ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
}

export default OrderFilter;
