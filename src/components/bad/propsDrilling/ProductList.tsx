import type { CartItem, Order, User } from '@/types/propsDrilling';

type ProductListProps = {
  addToCart: (product: CartItem) => void;
  user: User;
  cartItems: CartItem[];
  orders: Order[];
  updateUserProfile: (newData: Partial<User>) => void;
  removeFromCart: (productId: number) => void;
  placeOrder: (orderData: Order) => void;
};

function ProductList({
  addToCart,
  // 이 컴포넌트는 addToCart만 필요한데 모든 props를 받음
  user,
  cartItems,
  orders,
  updateUserProfile,
  removeFromCart,
  placeOrder,
}: ProductListProps) {
  const products = [
    { id: 3, name: '노트북', price: 1200000 },
    { id: 4, name: '마우스', price: 50000 },
    { id: 5, name: '키보드', price: 150000 },
  ];

  return (
    <div className="product-list">
      <h2>상품 목록</h2>
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <h3>{product.name}</h3>
          <p>{product.price.toLocaleString()}원</p>
          <button
            type="button"
            onClick={() => addToCart({ ...product, quantity: 1 })}
          >
            장바구니에 추가
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
