"use client";

import { ResourceList } from "@/components/common/resource-list";
import { useGetCustomersQuery } from "@/lib/api";

export default function CustomersPage() {
  const { data, isLoading, isError } = useGetCustomersQuery();

  return (
    <ResourceList
      title="All Customers"
      isLoading={isLoading}
      isError={isError}
      total={data?.total}
      rows={
        data?.data.map(
          (customer) =>
            `${customer.fullName} | ${customer.email}${customer.phone ? ` | ${customer.phone}` : ""}`
        ) ?? []
      }
    />
  );
}
