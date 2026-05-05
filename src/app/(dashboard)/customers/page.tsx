import type { Metadata } from "next";
import { CustomersTable } from "./customers-table";

export const metadata: Metadata = {
  title: "Customers",
  description: "Дані клієнтів.",
};

export default function CustomersPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1280px] pt-2 md:pt-[18px] xl:pt-[43px]">
      <CustomersTable />
    </div>
  );
}
