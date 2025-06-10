import Header from '@/components/bad/propsDrilling/Header';
import MainContent from '@/components/bad/propsDrilling/MainConent';
import type { CartItem, Order, User } from '@/types/propsDrilling';
import { useState } from 'react';

/*
😱 문제점:

1. Props Hell: 5단계에 걸쳐 props가 전달됨
2. 불필요한 의존성: 중간 컴포넌트들이 사용하지 않는 props를 받음
3. 유지보수 어려움: props 변경 시 모든 중간 컴포넌트 수정 필요
4. 성능 문제: 불필요한 re-render 발생 가능
5. 코드 가독성: 어떤 컴포넌트가 실제로 props를 사용하는지 파악 어려움
*/

function App() {
  const [user, setUser] = useState<User>({
    id: 1,
    name: '김철수',
    role: 'admin',
    theme: 'dark',
    language: 'ko',
    notifications: true,
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: '상품1', price: 10000, quantity: 2 },
    { id: 2, name: '상품2', price: 20000, quantity: 1 },
  ]);

  const [orders, setOrders] = useState<Order[]>([]);

  const updateUserProfile = (newData: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  const addToCart = (product: CartItem) => {
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const placeOrder = (orderData: Order) => {
    setOrders((prev) => [...prev, orderData]);
    setCartItems([]);
  };

  return (
    <div className="app">
      {/* 😱 props를 Header로 전달 */}
      <Header
        user={user}
        cartItems={cartItems}
        updateUserProfile={updateUserProfile}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
      />

      {/* 😱 props를 MainContent로 전달 */}
      <MainContent
        user={user}
        cartItems={cartItems}
        orders={orders}
        updateUserProfile={updateUserProfile}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
      />
    </div>
  );
}

export default App;
