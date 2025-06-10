import type { CartItem, Order, User } from '@/types/propsDrilling';

// 5단계: CartSummary 컴포넌트 (드디어 실제 사용!)
type CartSummaryProps = {
  cartItems: CartItem[];
  removeFromCart: (productId: number) => void;
  placeOrder: (orderData: Order) => void;
  user: User;
};
function CartSummary({
  cartItems,
  removeFromCart,
  placeOrder,
  user,
}: CartSummaryProps) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleOrder = () => {
    const orderData = {
      id: Date.now(),
      userId: user.id,
      items: cartItems,
      total,
      date: new Date(),
    };
    placeOrder(orderData);
  };

  if (cartItems.length === 0) {
    return <div className="cart-empty">장바구니가 비어있습니다</div>;
  }

  return (
    <div className="cart-summary">
      <h3>장바구니 ({cartItems.length}개)</h3>
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>{item.quantity}개</span>
          <span>{(item.price * item.quantity).toLocaleString()}원</span>
          <button type="button" onClick={() => removeFromCart(item.id)}>
            삭제
          </button>
        </div>
      ))}
      <div className="cart-total">총 합계: {total.toLocaleString()}원</div>
      <button type="button" onClick={handleOrder} className="order-button">
        주문하기
      </button>
    </div>
  );
}

export default CartSummary;
