"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  PRODUCT_CATEGORY_OPTIONS,
  ProductFormModal,
  type ProductFormValues,
} from "@/components/products/product-form-modal";
import { demoProducts } from "@/lib/demo-table-data";
import { cn } from "@/lib/utils";
import type { ProductRow } from "@/types/table";

function categoryLabel(value: string) {
  return (
    PRODUCT_CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value
  );
}

function rowToFormValues(row: ProductRow): Partial<ProductFormValues> {
  return {
    productInfo: row.productInfo,
    category: row.category,
    stock: row.stock,
    suppliers: row.suppliers,
    price: row.price,
  };
}

const columns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: "productInfo",
    header: "Product Info",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {categoryLabel(row.original.category)}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap tabular-nums">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "suppliers",
    header: "Suppliers",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap tabular-nums">{String(getValue())}</span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row, table }) => {
      const meta = table.options.meta as
        | {
            onEdit: (r: ProductRow) => void;
            onDelete: (r: ProductRow) => void;
          }
        | undefined;
      return (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/50 p-2 text-primary transition-colors",
              "hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            )}
            aria-label={`Редагувати ${row.original.productInfo}`}
            onClick={() => meta?.onEdit(row.original)}
          >
            <Pencil className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-danger/50 p-2 text-danger transition-colors",
              "hover:bg-danger-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/30"
            )}
            aria-label={`Видалити ${row.original.productInfo}`}
            onClick={() => meta?.onDelete(row.original)}
          >
            <Trash2 className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      );
    },
  },
];

export function ProductsTable() {
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formKey, setFormKey] = useState(0);
  const [editDefaults, setEditDefaults] = useState<
    Partial<ProductFormValues> | undefined
  >(undefined);

  const openAdd = useCallback(() => {
    setFormMode("add");
    setEditDefaults(undefined);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((row: ProductRow) => {
    setFormMode("edit");
    setEditDefaults(rowToFormValues(row));
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }, []);

  const onDelete = useCallback((_row: ProductRow) => {
    // TODO: підтвердження + API
  }, []);

  return (
    <>
      <DataTable<ProductRow>
        title="All products"
        columns={columns}
        data={demoProducts}
        variant="full"
        searchPlaceholder="Product Name"
        searchAriaLabel="Search by product name"
        pageSize={5}
        getGlobalFilterText={(row) => {
          const cat = categoryLabel(row.category);
          return `${row.productInfo} ${cat} ${row.suppliers} ${row.stock} ${row.price}`;
        }}
        meta={{
          onEdit: openEdit,
          onDelete,
        }}
        toolbarEnd={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page rounded-lg"
          >
            <span className="inline-flex items-center justify-center rounded-full bg-primary p-[13px] text-white">
              <Plus className="size-4" strokeWidth={2} aria-hidden />
            </span>
            <span className="text-sm font-medium leading-[18px] text-foreground">
              Add a new product
            </span>
          </button>
        }
      />
      <ProductFormModal
        key={formKey}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        defaultValues={formMode === "edit" ? editDefaults : undefined}
      />
    </>
  );
}
