import CartSummary from '@/components/bad/propsDrilling/CartSummary';
import type { CartItem, Order, User } from '@/types/propsDrilling';

// 4단계: DropdownContent 컴포넌트 (여전히 모든 props 받음)
type DropdownContentProps = {
  user: User;
  cartItems: CartItem[];
  updateUserProfile: (newData: Partial<User>) => void;
  removeFromCart: (productId: number) => void;
  placeOrder: (orderData: Order) => void;
};

function DropdownContent({
  user,
  cartItems,
  updateUserProfile,
  removeFromCart,
  placeOrder,
}: DropdownContentProps) {
  return (
    <div className="dropdown-content">
      <div className="profile-section">
        <p>안녕하세요, {user.name}님!</p>
        <p>역할: {user.role}</p>
      </div>

      {/* 😱 CartSummary에 또 모든 props 전달 */}
      <CartSummary
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
        user={user}
      />

      <div className="menu-actions">
        <button
          type="button"
          onClick={() =>
            updateUserProfile({
              theme: user.theme === 'dark' ? 'light' : 'dark',
            })
          }
        >
          테마 변경
        </button>
        <button type="button">로그아웃</button>
      </div>
    </div>
  );
}

export default DropdownContent;
