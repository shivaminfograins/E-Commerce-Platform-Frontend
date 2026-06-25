import OrderCard from "./OrderCard";

function OrderList({ orders, onViewDetails }) {
  return (
    <div>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}

export default OrderList;
