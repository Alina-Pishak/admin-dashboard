"use client";

import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { StatusBadge, type StatusTone } from "@/components/common/status-badge";
import { useGetOrdersQuery } from "@/lib/api";
import type { Order } from "@/types/entities";

const columns: DataTableColumn<Order>[] = [
  {
    key: "customer",
    header: "User Info",
    cell: (row) => row.customerName,
  },
  {
    key: "address",
    header: "Address",
    cell: () => "-",
  },
  {
    key: "products",
    header: "Products",
    cell: () => "-",
  },
  {
    key: "date",
    header: "Order date",
    cell: (row) =>
      new Date(row.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
  },
  {
    key: "price",
    header: "Price",
    cell: (row) => `$${row.total.toFixed(2)}`,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => {
      const toneByStatus: Record<Order["status"], StatusTone> = {
        completed: "completed",
        processing: "processing",
        new: "pending",
        canceled: "cancelled",
      };

      const tone = toneByStatus[row.status];
      const label = tone.charAt(0).toUpperCase() + tone.slice(1);
      return <StatusBadge tone={tone} label={label} />;
    },
  },
];

export default function OrdersPage() {
  const { data, isLoading, isError } = useGetOrdersQuery();

  return (
    <DataTable
      title="All Orders"
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
