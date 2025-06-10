import OrderHistory from '@/components/good/propsDrilling/OrderHistory';
import ProductList from '@/components/good/propsDrilling/ProductList';

function MainContent() {
  return (
    <main className="main-content">
      <ProductList />
      <OrderHistory />
    </main>
  );
}

export default MainContent;
