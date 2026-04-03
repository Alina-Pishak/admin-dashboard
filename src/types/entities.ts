export type UserRole = "admin" | "manager" | "viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type ListResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type Order = {
  id: string;
  number: string;
  status: "new" | "processing" | "completed" | "canceled";
  total: number;
  customerName: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
};

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};
