import type { CartItem } from '@/types/propsDrilling';
import { createContext, useContext, useReducer } from 'react';

type AddItemAction = {
  type: 'ADD_ITEM';
  payload: CartItem;
};

type RemoveItemAction = {
  type: 'REMOVE_ITEM';
  payload: number;
};

type ClearCartAction = {
  type: 'CLEAR_CART';
};

type UpdateQuantityAction = {
  type: 'UPDATE_QUANTITY';
  payload: { id: number; quantity: number };
};

const CartContext = createContext<{
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
} | null>(null);

const cartReducer = (
  state: CartItem[],
  action:
    | AddItemAction
    | RemoveItemAction
    | ClearCartAction
    | UpdateQuantityAction,
) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
      const existingItem = state.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];

    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload);

    case 'CLEAR_CART':
      return [];

    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item,
      );

    default:
      return state;
  }
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [
    { id: 1, name: '상품1', price: 10000, quantity: 2 },
    { id: 2, name: '상품2', price: 20000, quantity: 1 },
  ]);

  const addToCart = (product: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartProvider;
