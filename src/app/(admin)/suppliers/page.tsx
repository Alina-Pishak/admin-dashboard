"use client";

import { ResourceList } from "@/components/common/resource-list";
import { useGetSuppliersQuery } from "@/lib/api";

export default function SuppliersPage() {
  const { data, isLoading, isError } = useGetSuppliersQuery();

  return (
    <ResourceList
      title="All Suppliers"
      isLoading={isLoading}
      isError={isError}
      total={data?.total}
      rows={
        data?.data.map(
          (supplier) =>
            `${supplier.name} | ${supplier.email}${supplier.phone ? ` | ${supplier.phone}` : ""}`
        ) ?? []
      }
    />
  );
}
