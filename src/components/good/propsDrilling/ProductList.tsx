import { useCart } from '@/stores/cart';

function ProductList() {
  const { addToCart } = useCart();

  const products = [
    { id: 3, name: '노트북', price: 1200000 },
    { id: 4, name: '마우스', price: 50000 },
    { id: 5, name: '키보드', price: 150000 },
  ];

  return (
    <div className="product-list">
      <h2>상품 목록</h2>
      {products.map((product) => (
        <div className="product-item" key={product.id}>
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
