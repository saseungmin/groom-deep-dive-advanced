import ProductList from '@/components/bad/propsDrilling/ProductList';
import type { CartItem, Order, User } from '@/types/propsDrilling';

type MainContentProps = {
  user: User;
  cartItems: CartItem[];
  orders: Order[];
  updateUserProfile: (newData: Partial<User>) => void;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  placeOrder: (orderData: Order) => void;
};

function MainContent({
  user,
  cartItems,
  orders,
  updateUserProfile,
  addToCart,
  removeFromCart,
  placeOrder,
}: MainContentProps) {
  return (
    <main className="main-content">
      {/* 😱 ProductList에 불필요한 props까지 모두 전달 */}
      <ProductList
        user={user}
        addToCart={addToCart}
        cartItems={cartItems}
        orders={orders}
        updateUserProfile={updateUserProfile}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
      />
    </main>
  );
}

export default MainContent;
