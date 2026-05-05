import type { Metadata } from "next";
import { SuppliersTable } from "./suppliers-table";

export const metadata: Metadata = {
  title: "Suppliers",
  description: "Постачальники та поставки.",
};

export default function SuppliersPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1280px]">
      <SuppliersTable />
    </div>
  );
}
