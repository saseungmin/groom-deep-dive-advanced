export type User = {
  id: number;
  name: string;
  role: string;
  theme: string;
  language: string;
  notifications: boolean;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  date: Date;
};
