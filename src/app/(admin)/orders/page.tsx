"use client";

import { ResourceList } from "@/components/common/resource-list";
import { useGetOrdersQuery } from "@/lib/api";

export default function OrdersPage() {
  const { data, isLoading, isError } = useGetOrdersQuery();

  return (
    <ResourceList
      title="All Orders"
      isLoading={isLoading}
      isError={isError}
      total={data?.total}
      rows={
        data?.data.map(
          (order) =>
            `#${order.number} | ${order.customerName} | ${order.status} | $${order.total}`
        ) ?? []
      }
    />
  );
}
