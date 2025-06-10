import { useCart } from '@/stores/cart';
import type { CartItem as CartItemType } from '@/types/propsDrilling';

function CartItem({ item }: { item: CartItemType }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="cart-item">
      <span>{item.name}</span>
      <div className="quantity-controls">
        <button
          type="button"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          -
        </button>
        <span>{item.quantity}개</span>
        <button
          type="button"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>
      <span>{(item.price * item.quantity).toLocaleString()}원</span>
      <button type="button" onClick={() => removeFromCart(item.id)}>
        삭제
      </button>
    </div>
  );
}

export default CartItem;
