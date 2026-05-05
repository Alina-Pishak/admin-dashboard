"use client";

import type { LedgerRow } from "@/lib/demo-ledger";
import type {
  CustomerRow,
  OrderRow,
  OrderStatus,
  ProductRow,
  SupplierListStatus,
  SupplierRow,
} from "@/types/table";
import {
  clearAuthSessionCookie,
  clearStoredToken,
  setStoredToken,
  syncAuthSessionCookie,
} from "@/lib/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RequestOptions = RequestInit & {
  token?: string | null;
  /** Не викликати POST /api/users/refresh при 401 (логін, logout, refresh) */
  skipAuthRetry?: boolean;
};

let refreshInFlight: Promise<string | null> | null = null;

/** Cookie refresh з бекенду (path `/api/users/refresh`). */
function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) return null;
        const next =
          typeof body?.token === "string"
            ? body.token
            : typeof body?.accessToken === "string"
              ? body.accessToken
              : null;
        if (next) {
          setStoredToken(next);
          void syncAuthSessionCookie(next);
        }
        return next;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

export type DashboardResponse = {
  summary: {
    products: number;
    suppliers: number;
    clients: number;
  };
  lastClients: Array<{
    _id?: string;
    id?: string;
    name?: string;
    email?: string | null;
    spent?: number | string;
    address?: string;
    phone?: string;
    register_date?: string;
    registerDate?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  transactions: Array<{
    name?: string;
    amount?: number | string;
    type?: string;
    createdAt?: string;
  }>;
};

export type ProductPayload = {
  name: string;
  category: string;
  stock: number;
  suppliers: string[];
  price: number;
};

export type SupplierPayload = {
  name: string;
  address: string;
  suppliers: string;
  date: string;
  amount: string;
  status: string;
};

async function apiFetch<T>(path: string, options: RequestOptions = {}) {
  const { token, headers, skipAuthRetry, ...init } = options;

  const bearer =
    typeof token === "string" && token.length > 0 ? token : undefined;

  const runFetch = (bearerToken: string | undefined) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: init.credentials ?? "omit",
      headers: {
        "Content-Type": "application/json",
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        ...headers,
      },
      cache: "no-store",
    });

  let response = await runFetch(bearer);
  let payload = await response.json().catch(() => null);

  const mayRefresh =
    response.status === 401 &&
    !skipAuthRetry &&
    path !== "/api/users/login" &&
    path !== "/api/users/refresh" &&
    bearer !== undefined;

  if (mayRefresh) {
    const nextAccess = await refreshAccessToken();
    if (nextAccess) {
      response = await runFetch(nextAccess);
      payload = await response.json().catch(() => null);
    } else {
      clearStoredToken();
      void clearAuthSessionCookie();
    }
  }

  if (!response.ok) {
    throw new Error(
      payload?.message || `API request failed with status ${response.status}`,
    );
  }

  return payload as T;
}

export function loginUserRequest(email: string, password: string) {
  return apiFetch<{ token: string; accessToken?: string }>("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include",
    skipAuthRetry: true,
  });
}

export function logoutUserRequest(token: string) {
  return apiFetch<{ message: string }>("/api/users/logout", {
    method: "POST",
    token,
    credentials: "include",
    skipAuthRetry: true,
  });
}

export function getUserInfoRequest(token: string) {
  return apiFetch<{ id: string; name: string; email: string }>(
    "/api/users/user-info",
    {
      token,
    },
  );
}

export function getDashboardRequest() {
  return apiFetch<DashboardResponse>("/api/dashboard");
}

export function getProductsRequest(token: string) {
  return apiFetch<
    Array<{
      _id?: string;
      name?: string;
      category?: string;
      stock?: number;
      suppliers?: string[];
      price?: number;
      createdAt?: string;
      updatedAt?: string;
    }>
  >("/api/products?sortBy=createdAt&order=desc", {
    token,
  });
}

export function createProductRequest(token: string, payload: ProductPayload) {
  return apiFetch<{
    _id: string;
  }>("/api/products", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateProductRequest(
  token: string,
  productId: string,
  payload: ProductPayload,
) {
  return apiFetch<{
    _id: string;
  }>(`/api/products/${productId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteProductRequest(token: string, productId: string) {
  return apiFetch<{ message: string }>(`/api/products/${productId}`, {
    method: "DELETE",
    token,
  });
}

export function getSuppliersRequest() {
  return apiFetch<
    Array<{
      _id?: string;
      name?: string;
      address?: string;
      suppliers?: string;
      date?: string;
      amount?: string;
      status?: string;
      createdAt?: string;
      updatedAt?: string;
    }>
  >("/api/suppliers");
}

export function createSupplierRequest(token: string, payload: SupplierPayload) {
  return apiFetch<{
    _id: string;
  }>("/api/suppliers", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateSupplierRequest(
  token: string,
  supplierId: string,
  payload: SupplierPayload,
) {
  return apiFetch<{
    _id: string;
  }>(`/api/suppliers/${supplierId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function getCustomersRequest(token: string) {
  return apiFetch<{
    data?: Array<{
      _id?: string;
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      register_date?: string;
      registerDate?: string;
      createdAt?: string;
      spent?: string | number;
      updatedAt?: string;
    }>;
  }>("/api/customers", {
    token,
  });
}

export function getOrdersRequest(token: string) {
  return apiFetch<
    Array<{
      _id?: string;
      name?: string;
      photo?: string;
      address?: string;
      products?: string;
      order_date?: string;
      price?: number;
      status?: string;
      createdAt?: string;
      updatedAt?: string;
    }>
  >("/api/orders?sortBy=order_date&order=desc", {
    token,
  });
}

export function mapDashboardCustomers(
  customers: DashboardResponse["lastClients"],
): CustomerRow[] {
  return sortDocsNewestFirst(customers).map((customer, index) => ({
    id: customer._id ?? customer.id ?? `dashboard-customer-${index + 1}`,
    name: customer.name ?? "Unknown customer",
    email: customer.email ?? "—",
    spent:
      customer.spent == null
        ? "—"
        : Number(customer.spent).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
    address: customer.address,
    phone: customer.phone,
    registerDate: customer.register_date ?? customer.registerDate,
  }));
}

export function mapDashboardTransactions(
  transactions: DashboardResponse["transactions"],
): LedgerRow[] {
  return sortDocsNewestFirst(transactions).map((transaction, index) => {
    const kind = normalizeLedgerKind(transaction.type);
    const amountNumber = Number(transaction.amount ?? 0);
    const sign = kind === "expense" ? "-" : "+";
    return {
      id: `tx-${index + 1}`,
      kind,
      description: transaction.name ?? "Transaction",
      amount: `${sign}${Math.abs(amountNumber).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      strikethrough: kind === "error",
    };
  });
}

export function mapProductsToRows(
  products: Awaited<ReturnType<typeof getProductsRequest>>,
): ProductRow[] {
  return sortDocsNewestFirst(products).map((product, index) => ({
    id: product._id ?? `product-${index + 1}`,
    name: product.name ?? "Unnamed product",
    category: product.category ?? "medicine",
    stock: String(product.stock ?? 0).padStart(2, "0"),
    suppliers: (product.suppliers ?? []).join(", "),
    price: formatDecimal(product.price),
  }));
}

export function mapSuppliersToRows(
  suppliers: Awaited<ReturnType<typeof getSuppliersRequest>>,
): SupplierRow[] {
  return sortDocsNewestFirst(suppliers).map((supplier, index) => ({
    id: supplier._id ?? `supplier-${index + 1}`,
    name: supplier.name ?? "Unknown supplier",
    address: supplier.address ?? "—",
    company: supplier.suppliers ?? "—",
    deliveryDate: toIsoDate(supplier.date),
    amount: supplier.amount ?? "0",
    status: normalizeSupplierStatus(supplier.status),
  }));
}

export function mapCustomersToRows(
  customers: NonNullable<
    Awaited<ReturnType<typeof getCustomersRequest>>["data"]
  >,
): CustomerRow[] {
  return sortDocsNewestFirst(customers).map((customer, index) => ({
    id: customer._id ?? `customer-${index + 1}`,
    name: customer.name ?? "Unknown customer",
    email: customer.email ?? "—",
    spent:
      customer.spent == null
        ? "—"
        : Number(customer.spent).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
    address: customer.address,
    phone: customer.phone,
    registerDate:
      customer.register_date ?? customer.registerDate ?? customer.createdAt,
  }));
}

export function mapOrdersToRows(
  orders: Awaited<ReturnType<typeof getOrdersRequest>>,
): OrderRow[] {
  return sortDocsNewestFirst(orders).map((order, index) => ({
    id: order._id ?? `order-${index + 1}`,
    userName: order.name ?? "Unknown user",
    address: order.address ?? "—",
    products: Number(order.products ?? 0) || 0,
    orderDate: formatOrderDate(order.order_date),
    price: formatDecimal(order.price),
    status: normalizeOrderStatus(order.status),
  }));
}

export function productFormToPayload(input: {
  name: string;
  category: string;
  stock: string;
  suppliers: string;
  price: string;
}): ProductPayload {
  return {
    name: input.name.trim(),
    category: input.category,
    stock: Number(input.stock),
    suppliers: input.suppliers
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    price: Number(input.price),
  };
}

export function supplierFormToPayload(input: {
  name: string;
  address: string;
  company: string;
  deliveryDate: string;
  amount: string;
  status: string;
}): SupplierPayload {
  const deliveryDate = new Date(input.deliveryDate);
  return {
    name: input.name.trim(),
    address: input.address.trim(),
    suppliers: input.company.trim(),
    date: Number.isNaN(deliveryDate.getTime())
      ? input.deliveryDate
      : deliveryDate.toISOString(),
    amount: input.amount.trim(),
    status: input.status,
  };
}

/** Документ з API / Mongo: новіші записи першими (createdAt → … → _id). */
type SortableDoc = {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  order_date?: string;
  register_date?: string;
  registerDate?: string;
  date?: string;
};

function timestampFromDoc(doc: SortableDoc): number {
  const keys: (keyof SortableDoc)[] = [
    "createdAt",
    "updatedAt",
    "order_date",
    "register_date",
    "registerDate",
    "date",
  ];
  for (const key of keys) {
    const raw = doc[key];
    if (raw == null || raw === "") continue;
    const t = Date.parse(String(raw));
    if (!Number.isNaN(t)) return t;
  }
  const id = doc._id;
  if (typeof id === "string" && /^[a-f0-9]{24}$/i.test(id)) {
    return Number.parseInt(id.slice(0, 8), 16) * 1000;
  }
  return 0;
}

function sortDocsNewestFirst<T extends SortableDoc>(items: T[]): T[] {
  return [...items].sort((a, b) => timestampFromDoc(b) - timestampFromDoc(a));
}

function normalizeSupplierStatus(value?: string): SupplierListStatus {
  const normalized = String(value ?? "").toLowerCase();
  return normalized === "active" ? "active" : "deactive";
}

function normalizeOrderStatus(value?: string): OrderStatus {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "completed") return "completed";
  if (normalized === "confirmed") return "confirmed";
  if (normalized === "cancelled") return "cancelled";
  if (normalized === "processing") return "processing";
  return "pending";
}

function normalizeLedgerKind(value?: string): LedgerRow["kind"] {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "income") return "income";
  if (normalized === "expense") return "expense";
  return "error";
}

function formatDecimal(value?: number | string) {
  return Number(value ?? 0).toFixed(2);
}

function toIsoDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function formatOrderDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
