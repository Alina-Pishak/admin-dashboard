"use client";

import { ResourceList } from "@/components/common/resource-list";
import { useGetProductsQuery } from "@/lib/api";

export default function ProductsPage() {
  const { data, isLoading, isError } = useGetProductsQuery();

  return (
    <ResourceList
      title="All Products"
      isLoading={isLoading}
      isError={isError}
      total={data?.total}
      rows={
        data?.data.map(
          (product) =>
            `${product.name} | SKU: ${product.sku} | $${product.price} | Stock: ${product.stock}`
        ) ?? []
      }
    />
  );
}
