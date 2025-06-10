import Header from '@/components/good/propsDrilling/Header';
import MainContent from '@/components/good/propsDrilling/MainContent';
import CartProvider from '@/stores/cart';
import OrderProvider from '@/stores/order';
import UserProvider from '@/stores/user';

/*
😊 개선된 점들:

1. ✅ Props Drilling 제거: Context로 필요한 데이터 직접 접근
2. ✅ 관심사 분리: 각 Context가 특정 도메인만 담당
3. ✅ 유지보수성: 중간 컴포넌트 수정 없이 데이터 흐름 변경 가능
4. ✅ 성능 최적화: 필요한 컴포넌트만 re-render
5. ✅ 코드 가독성: 각 컴포넌트가 실제 사용하는 데이터만 명시
6. ✅ 테스트 용이성: 각 컴포넌트를 독립적으로 테스트 가능
7. ✅ 재사용성: 컴포넌트들이 props에 덜 의존적
*/

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <OrderProvider>
          <div className="app">
            <Header />
            <MainContent />
          </div>
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
