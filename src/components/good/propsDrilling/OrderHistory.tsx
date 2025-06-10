import { useOrder } from '@/stores/order';

function OrderHistory() {
  const { orders } = useOrder();

  if (orders.length === 0) {
    return <div>주문 내역이 없습니다.</div>;
  }

  return (
    <div className="order-history">
      <h2>주문 내역</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <p>주문 번호: {order.id}</p>
          <p>총 금액: {order.total.toLocaleString()}원</p>
          <p>주문 일시: {order.date.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
