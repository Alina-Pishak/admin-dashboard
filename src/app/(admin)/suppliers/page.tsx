"use client";

import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { useGetSuppliersQuery } from "@/lib/api";
import type { Supplier } from "@/types/entities";

const columns: DataTableColumn<Supplier>[] = [
  {
    key: "name",
    header: "Supplier Name",
    cell: (row) => row.name,
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

export default function SuppliersPage() {
  const { data, isLoading, isError } = useGetSuppliersQuery();

  return (
    <DataTable
      title="All Suppliers"
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
