import type { Order } from '@/types/propsDrilling';
import { createContext, useContext, useState } from 'react';

const OrderContext = createContext<{
  orders: Order[];
  placeOrder: (orderData: Order) => void;
} | null>(null);

const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = (orderData: Order) => {
    const newOrder = {
      ...orderData,
      id: Date.now(),
      date: new Date(),
    };
    setOrders((prev) => [...prev, newOrder]);
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};
