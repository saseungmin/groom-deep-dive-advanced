import DropdownContent from '@/components/good/propsDrilling/DropdownContent';
import { useCart } from '@/stores/cart';
import { useUser } from '@/stores/user';
import { useState } from 'react';

function UserMenu() {
  const { user } = useUser();
  const { cartCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="user-menu">
      <button
        type="button"
        className="user-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user.name} ({cartCount})
      </button>

      {showDropdown && (
        <div className="dropdown">
          <DropdownContent />
        </div>
      )}
    </div>
  );
}

export default UserMenu;
