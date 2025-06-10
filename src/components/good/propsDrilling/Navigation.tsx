import UserMenu from '@/components/good/propsDrilling/UserMenu';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-links">
        <a href="/">홈</a>
        <a href="/products">상품</a>
        <a href="/about">소개</a>
      </div>
      <UserMenu />
    </nav>
  );
}

export default Navigation;
