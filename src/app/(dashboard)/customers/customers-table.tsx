"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DataTable } from "@/components/ui/data-table";
import { parseIsoLocal } from "@/components/ui";
import { demoCustomers } from "@/lib/demo-table-data";
import type { CustomerRow } from "@/types/table";

function formatRegisterDate(iso: string | undefined) {
  if (!iso) return "";
  const d = parseIsoLocal(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const columns: ColumnDef<CustomerRow>[] = [
  {
    id: "userInfo",
    header: "User Info",
    cell: ({ row }) => (
      <div className="flex max-w-[220px] items-center gap-2">
        <Image
          src={`https://picsum.photos/seed/cust-${row.original.id}/72/72`}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full bg-[#e0e0e0] object-cover"
        />
        <span className="min-w-0 truncate font-medium whitespace-nowrap text-foreground">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {row.original.address ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="whitespace-nowrap tabular-nums">
        {row.original.phone ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "registerDate",
    header: "Register date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatRegisterDate(row.original.registerDate)}
      </span>
    ),
  },
];

export function CustomersTable() {
  return (
    <DataTable<CustomerRow>
      title="Customers Data"
      columns={columns}
      data={demoCustomers}
      variant="full"
      searchPlaceholder="User Name"
      searchAriaLabel="Search by user name"
      pageSize={5}
      getGlobalFilterText={(row) => {
        const reg = formatRegisterDate(row.registerDate);
        return `${row.name} ${row.email} ${row.address ?? ""} ${row.phone ?? ""} ${reg}`;
      }}
    />
  );
}
