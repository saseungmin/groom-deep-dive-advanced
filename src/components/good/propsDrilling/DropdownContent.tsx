import CartSummary from '@/components/good/propsDrilling/CartSummary';
import { useUser } from '@/stores/user';

function DropdownContent() {
  const { user, updateUserProfile } = useUser();

  return (
    <div className="dropdown-content">
      <div className="profile-section">
        <p>안녕하세요, {user.name}님!</p>
        <p>역할: {user.role}</p>
      </div>

      <CartSummary />

      <div className="menu-actions">
        <button
          type="button"
          onClick={() =>
            updateUserProfile({
              theme: user.theme === 'dark' ? 'light' : 'dark',
            })
          }
        >
          테마 변경 ({user.theme})
        </button>
        <button type="button">로그아웃</button>
      </div>
    </div>
  );
}

export default DropdownContent;
