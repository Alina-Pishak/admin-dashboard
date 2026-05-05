import type { Metadata } from "next";
import { OrdersTable } from "./orders-table";

export const metadata: Metadata = {
  title: "Orders",
  description: "Список замовлень.",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px]">
      <OrdersTable />
    </div>
  );
}
