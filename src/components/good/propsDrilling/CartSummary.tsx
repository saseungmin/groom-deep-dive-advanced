import CartItem from '@/components/good/propsDrilling/CartItem';
import { useCart } from '@/stores/cart';
import { useOrder } from '@/stores/order';
import { useUser } from '@/stores/user';

function CartSummary() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const { user } = useUser();

  const handleOrder = () => {
    const orderData = {
      userId: user.id,
      items: cartItems,
      total: cartTotal,
      date: new Date(),
      id: Date.now(),
    };
    placeOrder(orderData);
    clearCart();
  };

  if (cartItems.length === 0) {
    return <div className="cart-empty">장바구니가 비어있습니다</div>;
  }

  return (
    <div className="cart-summary">
      <h3>장바구니 ({cartItems.length}개)</h3>
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
      <div className="cart-total">총 합계: {cartTotal.toLocaleString()}원</div>
      <button type="button" onClick={handleOrder} className="order-button">
        주문하기
      </button>
    </div>
  );
}

export default CartSummary;
