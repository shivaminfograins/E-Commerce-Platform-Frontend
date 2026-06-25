function OrderCard({ order, onViewDetails }) {
  return (
    <div className="order-card">
      <div className="order-image">
        <img src={order.image} alt={order.productName} />
      </div>

      <div className="order-info">
        <h3>{order.productName}</h3>

        <p>{order.brand}</p>

        <p>Order ID : {order.id}</p>

        <p>Qty : {order.quantity}</p>
      </div>

      <div className="order-price">₹{order.price.toLocaleString()}</div>

      <div className="order-action">
        <span className={`status ${order.status.toLowerCase()}`}>
          {order.status}
        </span>

        <button className="btn btn--primary" onClick={() => onViewDetails && onViewDetails(order)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
