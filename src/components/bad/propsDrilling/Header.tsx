import Navigation from '@/components/bad/propsDrilling/Navigation';
import type { CartItem, Order, User } from '@/types/propsDrilling';

// 1단계: Header 컴포넌트 (대부분의 props를 사용하지 않음)
type HeaderProps = {
  user: User;
  cartItems: CartItem[];
  updateUserProfile: (newData: Partial<User>) => void;
  removeFromCart: (productId: number) => void;
  placeOrder: (orderData: Order) => void;
};

const Header = ({
  user,
  cartItems,
  updateUserProfile,
  removeFromCart,
  placeOrder,
}: HeaderProps) => {
  return (
    <header className="header">
      <div className="logo">쇼핑몰</div>

      {/* 😱 Navigation에 또 모든 props 전달 */}
      <Navigation
        user={user}
        cartItems={cartItems}
        updateUserProfile={updateUserProfile}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
      />
    </header>
  );
};

export default Header;
