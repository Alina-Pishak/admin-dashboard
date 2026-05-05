"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { DeleteProductConfirmModal } from "@/components/products/delete-product-confirm-modal";
import {
  PRODUCT_CATEGORY_OPTIONS,
  ProductFormModal,
  type ProductFormValues,
} from "@/components/products/product-form-modal";
import {
  createProductRequest,
  deleteProductRequest,
  getProductsRequest,
  mapProductsToRows,
  productFormToPayload,
  updateProductRequest,
} from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
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
    name: row.name,
    category: row.category,
    stock: row.stock,
    suppliers: row.suppliers,
    price: row.price,
  };
}

const columns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: "name",
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
      <span className="whitespace-nowrap tabular-nums">
        {String(getValue())}
      </span>
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
      <span className="whitespace-nowrap tabular-nums">
        {String(getValue())}
      </span>
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
              "hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
            )}
            aria-label={`Редагувати ${row.original.name}`}
            onClick={() => meta?.onEdit(row.original)}
          >
            <Pencil className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-danger/50 p-2 text-danger transition-colors",
              "hover:bg-danger-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/30",
            )}
            aria-label={`Видалити ${row.original.name}`}
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
  const [rows, setRows] = useState(demoProducts);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formKey, setFormKey] = useState(0);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editDefaults, setEditDefaults] = useState<
    Partial<ProductFormValues> | undefined
  >(undefined);

  const openAdd = useCallback(() => {
    setFormMode("add");
    setEditingRowId(null);
    setEditDefaults(undefined);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((row: ProductRow) => {
    setFormMode("edit");
    setEditingRowId(row.id);
    setEditDefaults(rowToFormValues(row));
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }, []);

  const loadProducts = useCallback(async (authToken: string) => {
    const products = await getProductsRequest(authToken);
    setRows(mapProductsToRows(products));
  }, []);

  const requestDelete = useCallback((row: ProductRow) => {
    setDeleteTarget(row);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const token = getStoredToken();
    if (!token) return;
    setDeletePending(true);
    try {
      await deleteProductRequest(token, deleteTarget.id);
      setRows((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeletePending(false);
    }
  }, [deleteTarget]);

  const handleFormSubmit = useCallback(
    async (values: ProductFormValues) => {
      const token = getStoredToken();
      if (!token) {
        throw new Error("Unauthorized");
      }
      const payload = productFormToPayload(values);
      setLoading(true);
      try {
        if (formMode === "add") {
          await createProductRequest(token, payload);
        } else if (editingRowId) {
          await updateProductRequest(token, editingRowId, payload);
        } else {
          throw new Error("Missing editing item id");
        }
        await loadProducts(token);
      } finally {
        setLoading(false);
      }
    },
    [editingRowId, formMode, loadProducts],
  );

  useEffect(() => {
    const authToken = getStoredToken();
    if (!authToken) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      loadProducts(authToken)
        .catch(() => {
          if (!cancelled) setRows(demoProducts);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [loadProducts]);

  return (
    <>
      <DataTable<ProductRow>
        title="All products"
        columns={columns}
        data={rows}
        isLoading={loading}
        variant="full"
        searchPlaceholder="Product Name"
        searchAriaLabel="Search by product name"
        pageSize={5}
        getGlobalFilterText={(row) => {
          const cat = categoryLabel(row.category);
          return `${row.name} ${cat} ${row.suppliers} ${row.stock} ${row.price}`;
        }}
        meta={{
          onEdit: openEdit,
          onDelete: requestDelete,
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
        onSubmit={handleFormSubmit}
      />
      <DeleteProductConfirmModal
        open={deleteTarget != null}
        productName={deleteTarget?.name ?? ""}
        pending={deletePending}
        onClose={() => {
          if (!deletePending) setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
