"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { parseIsoLocal } from "@/components/ui";
import { getCustomersRequest, mapCustomersToRows } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import { demoCustomers } from "@/lib/demo-table-data";
import type { CustomerRow } from "@/types/table";

function formatRegisterDate(iso: string | undefined) {
  if (!iso) return "";
  const nativeDate = new Date(iso);
  if (!Number.isNaN(nativeDate.getTime())) {
    return nativeDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  const d = parseIsoLocal(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
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
  const [rows, setRows] = useState(demoCustomers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      getCustomersRequest(token)
        .then((response) => {
          if (!cancelled) {
            setRows(
              response.data?.length
                ? mapCustomersToRows(response.data)
                : demoCustomers,
            );
          }
        })
        .catch(() => {
          if (!cancelled) setRows(demoCustomers);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <DataTable<CustomerRow>
      title="Customers Data"
      columns={columns}
      data={rows}
      isLoading={loading}
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
