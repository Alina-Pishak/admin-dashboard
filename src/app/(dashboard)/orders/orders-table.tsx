"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getOrdersRequest, mapOrdersToRows } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { demoOrders } from "@/lib/demo-table-data";
import type { OrderRow } from "@/types/table";

const columns: ColumnDef<OrderRow>[] = [
  {
    id: "userInfo",
    accessorKey: "userName",
    header: "User Info",
    cell: ({ row }) => (
      <div className="flex max-w-[220px] items-center gap-2">
        <Image
          src={`https://picsum.photos/seed/order-${row.original.id}/72/72`}
          alt=""
          width={36}
          height={36}
          className="size-6 shrink-0 rounded-full object-cover md:size-9"
        />
        <span className="min-w-0 truncate whitespace-nowrap">
          {row.original.userName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "orderDate",
    header: "Order date",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const v = getValue() as OrderRow["status"];
      const label =
        v === "completed"
          ? "Completed"
          : v === "confirmed"
            ? "Confirmed"
            : v === "pending"
              ? "Pending"
              : v === "cancelled"
                ? "Cancelled"
                : "Processing";
      return (
        <Badge variant={v} className="px-2 py-1 text-xs md:text-sm">
          {label}
        </Badge>
      );
    },
  },
];

export function OrdersTable() {
  const [rows, setRows] = useState(demoOrders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      getOrdersRequest(token)
        .then((orders) => {
          if (!cancelled) setRows(mapOrdersToRows(orders));
        })
        .catch(() => {
          if (!cancelled) setRows(demoOrders);
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
    <DataTable<OrderRow>
      title="All orders"
      columns={columns}
      data={rows}
      isLoading={loading}
      variant="full"
      searchPlaceholder="User Name"
      pageSize={5}
      getGlobalFilterText={(row) => row.userName}
    />
  );
}
