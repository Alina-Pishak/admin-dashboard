"use client";

import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { useGetCustomersQuery } from "@/lib/api";
import type { Customer } from "@/types/entities";

const columns: DataTableColumn<Customer>[] = [
  {
    key: "name",
    header: "Full Name",
    cell: (row) => row.fullName,
  },
  {
    key: "email",
    header: "Email",
    cell: (row) => row.email,
  },
  {
    key: "phone",
    header: "Phone",
    cell: (row) => row.phone ?? "-",
  },
];

export default function CustomersPage() {
  const { data, isLoading, isError } = useGetCustomersQuery();

  return (
    <DataTable
      title="All Customers"
      data={data?.data ?? []}
      columns={columns}
      getRowKey={(row) => row.id}
      isLoading={isLoading}
      isError={isError}
      total={data?.total}
      page={data?.page}
      totalPages={data ? Math.max(1, Math.ceil(data.total / data.limit)) : 5}
    />
  );
}
