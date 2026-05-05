"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DataTable } from "@/components/ui/data-table";
import { demoCustomers } from "@/lib/demo-table-data";
import type { CustomerRow } from "@/types/table";

const columns: ColumnDef<CustomerRow>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex max-w-[200px] items-center gap-2">
        <Image
          src={`https://picsum.photos/seed/cust-${row.original.id}/72/72`}
          alt=""
          width={36}
          height={36}
          className="size-6 shrink-0 rounded-full object-cover md:size-9"
        />
        <span className="min-w-0 truncate whitespace-nowrap">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => (
      <span className="min-w-0 text-muted md:text-foreground">
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "spent",
    header: "Spent",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{String(getValue())}</span>
    ),
  },
];

type RecentCustomersTableProps = {
  data?: CustomerRow[];
};

export function RecentCustomersTable({
  data = demoCustomers.slice(0, 5),
}: RecentCustomersTableProps) {
  return (
    <DataTable
      title="Recent Customers"
      columns={columns}
      data={data}
      variant="embedded"
    />
  );
}
