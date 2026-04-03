"use client";

import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { useGetProductsQuery } from "@/lib/api";
import type { Product } from "@/types/entities";

const columns: DataTableColumn<Product>[] = [
  {
    key: "name",
    header: "Product Name",
    cell: (row) => row.name,
  },
  {
    key: "sku",
    header: "SKU",
    cell: (row) => row.sku,
  },
  {
    key: "price",
    header: "Price",
    cell: (row) => `$${row.price.toFixed(2)}`,
  },
  {
    key: "stock",
    header: "Stock",
    cell: (row) => row.stock,
  },
];

export default function ProductsPage() {
  const { data, isLoading, isError } = useGetProductsQuery();

  return (
    <DataTable
      title="All Products"
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
