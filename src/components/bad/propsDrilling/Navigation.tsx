import UserMenu from '@/components/bad/propsDrilling/UserMenu';
import type { CartItem, Order, User } from '@/types/propsDrilling';

// 2단계: Navigation 컴포넌트 (일부 props만 사용)
type NavigationProps = {
  user: User;
  cartItems: CartItem[];
  updateUserProfile: (newData: Partial<User>) => void;
  removeFromCart: (productId: number) => void;
  placeOrder: (orderData: Order) => void;
};

function Navigation({
  user,
  cartItems,
  updateUserProfile,
  removeFromCart,
  placeOrder,
}: NavigationProps) {
  return (
    <nav className="navigation">
      <div className="nav-links">
        <a href="/">홈</a>
        <a href="/products">상품</a>
        <a href="/about">소개</a>
      </div>

      {/* 😱 UserMenu에 또 모든 props 전달 */}
      <UserMenu
        user={user}
        cartItems={cartItems}
        updateUserProfile={updateUserProfile}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
      />
    </nav>
  );
}

export default Navigation;
