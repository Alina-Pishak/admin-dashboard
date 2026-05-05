"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button, parseIsoLocal } from "@/components/ui";
import { DataTable } from "@/components/ui/data-table";
import {
  SupplierFormModal,
  type SupplierFormValues,
} from "@/components/suppliers/supplier-form-modal";
import {
  createSupplierRequest,
  getSuppliersRequest,
  mapSuppliersToRows,
  supplierFormToPayload,
  updateSupplierRequest,
} from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import { demoSuppliers } from "@/lib/demo-table-data";
import { cn } from "@/lib/utils";
import type { SupplierRow } from "@/types/table";

function formatDeliveryDate(iso: string) {
  const d = parseIsoLocal(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function rowToFormValues(row: SupplierRow): Partial<SupplierFormValues> {
  return {
    name: row.name,
    address: row.address,
    company: row.company,
    deliveryDate: row.deliveryDate,
    amount: row.amount,
    status: row.status === "deactive" ? "inactive" : row.status,
  };
}

const columns: ColumnDef<SupplierRow>[] = [
  {
    accessorKey: "name",
    header: "Suppliers Info",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{String(getValue())}</span>
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
    accessorKey: "company",
    header: "Company",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatDeliveryDate(row.original.deliveryDate)}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Ammount",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap tabular-nums">
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const active = row.original.status === "active";
      return (
        <span
          className={cn(
            "inline-flex rounded-[25px] px-5 py-2 text-xs font-medium uppercase tracking-[0.15px]",
            active
              ? "bg-primary-muted text-primary"
              : "bg-danger-muted text-danger",
          )}
        >
          {active ? "Active" : "Deactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row, table }) => {
      const meta = table.options.meta as
        | { onEdit: (r: SupplierRow) => void }
        | undefined;
      return (
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 rounded-[30px] border border-primary/50 px-[17px] py-2 text-base font-medium text-primary transition-colors",
            "hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
          )}
          onClick={() => meta?.onEdit(row.original)}
        >
          <Pencil className="size-3.5" strokeWidth={1.75} aria-hidden />
          Edit
        </button>
      );
    },
  },
];

export function SuppliersTable() {
  const [rows, setRows] = useState(demoSuppliers);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formKey, setFormKey] = useState(0);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editDefaults, setEditDefaults] = useState<
    Partial<SupplierFormValues> | undefined
  >(undefined);

  const openAdd = useCallback(() => {
    setFormMode("add");
    setEditingRowId(null);
    setEditDefaults(undefined);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((row: SupplierRow) => {
    setFormMode("edit");
    setEditingRowId(row.id);
    setEditDefaults(rowToFormValues(row));
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }, []);

  const loadSuppliers = useCallback(async () => {
    const suppliers = await getSuppliersRequest();
    setRows(mapSuppliersToRows(suppliers));
  }, []);

  const handleFormSubmit = useCallback(
    async (values: SupplierFormValues) => {
      const token = getStoredToken();
      if (!token) {
        throw new Error("Unauthorized");
      }
      const payload = supplierFormToPayload(values);
      setLoading(true);
      try {
        if (formMode === "add") {
          await createSupplierRequest(token, payload);
        } else if (editingRowId) {
          await updateSupplierRequest(token, editingRowId, payload);
        } else {
          throw new Error("Missing editing item id");
        }
        await loadSuppliers();
      } finally {
        setLoading(false);
      }
    },
    [editingRowId, formMode, loadSuppliers],
  );

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      loadSuppliers()
        .catch(() => {
          if (!cancelled) setRows(demoSuppliers);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [loadSuppliers]);

  return (
    <>
      <DataTable<SupplierRow>
        title="All suppliers"
        columns={columns}
        data={rows}
        isLoading={loading}
        variant="full"
        searchPlaceholder="User Name"
        searchAriaLabel="Search by user name"
        pageSize={5}
        getGlobalFilterText={(row) => {
          const d = formatDeliveryDate(row.deliveryDate);
          return `${row.name} ${row.address} ${row.company} ${d} ${row.amount} ${row.status === "active" ? "Active" : "Deactive"}`;
        }}
        meta={{ onEdit: openEdit } as never}
        toolbarEnd={
          <Button type="button" variant="outline" onClick={openAdd}>
            Add a new suppliers
          </Button>
        }
      />
      <SupplierFormModal
        key={formKey}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        defaultValues={formMode === "edit" ? editDefaults : undefined}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}
