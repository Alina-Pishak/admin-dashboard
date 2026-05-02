export type OrderStatus =
  | "completed"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "processing";

export type OrderRow = {
  id: string;
  userName: string;
  address: string;
  products: number;
  orderDate: string;
  price: string;
  status: OrderStatus;
};

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  spent: string;
};
