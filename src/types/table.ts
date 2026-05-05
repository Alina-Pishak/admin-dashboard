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
  /** Для повного списку клієнтів (сторінка All customers) */
  address?: string;
  phone?: string;
  /** Дата реєстрації, ISO `YYYY-MM-DD` */
  registerDate?: string;
};

/** Категорія як value з `PRODUCT_CATEGORY_OPTIONS` (medicine, heart, …) */
export type ProductRow = {
  id: string;
  name: string;
  category: string;
  stock: string;
  suppliers: string;
  price: string;
};

/** Статус у списку постачальників (макет All suppliers) */
export type SupplierListStatus = "active" | "deactive";

export type SupplierRow = {
  id: string;
  name: string;
  address: string;
  company: string;
  /** Дата поставки, ISO `YYYY-MM-DD` */
  deliveryDate: string;
  amount: string;
  status: SupplierListStatus;
};
