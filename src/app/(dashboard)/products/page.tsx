import type { Metadata } from "next";
import { ProductsTable } from "./products-table";

export const metadata: Metadata = {
  title: "Products",
  description: "Каталог товарів E-Pharmacy.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px]">
      <ProductsTable />
    </div>
  );
}
