import DropdownContent from '@/components/bad/propsDrilling/DropdownContent';
import type { CartItem, Order, User } from '@/types/propsDrilling';
import { useState } from 'react';

// 3단계: UserMenu 컴포넌트 (user만 직접 사용, 나머지는 전달용)
type UserMenuProps = {
  user: User;
  cartItems: CartItem[];
  updateUserProfile: (newData: Partial<User>) => void;
  removeFromCart: (productId: number) => void;
  placeOrder: (orderData: Order) => void;
};

const UserMenu = ({
  user,
  cartItems,
  updateUserProfile,
  removeFromCart,
  placeOrder,
}: UserMenuProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="user-menu">
      <button
        type="button"
        className="user-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user.name} ({cartItems.length})
      </button>

      {showDropdown && (
        <div className="dropdown">
          {/* 😱 DropdownContent에 또 모든 props 전달 */}
          <DropdownContent
            user={user}
            cartItems={cartItems}
            updateUserProfile={updateUserProfile}
            removeFromCart={removeFromCart}
            placeOrder={placeOrder}
          />
        </div>
      )}
    </div>
  );
};

export default UserMenu;
