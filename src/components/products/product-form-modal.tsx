"use client";

import { useCallback, useState } from "react";
import { Button, Input, Modal, Select, type SelectOption } from "@/components/ui";
import { cn } from "@/lib/utils";

/** Поля форми продукту — [Add / Edit product](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-804) */
export type ProductFormValues = {
  productInfo: string;
  category: string;
  stock: string;
  suppliers: string;
  price: string;
};

export const PRODUCT_CATEGORY_OPTIONS: SelectOption[] = [
  { value: "medicine", label: "Medicine" },
  { value: "heart", label: "Heart" },
  { value: "head", label: "Head" },
  { value: "hand", label: "Hand" },
  { value: "leg", label: "Leg" },
];

const EMPTY: ProductFormValues = {
  productInfo: "",
  category: "",
  stock: "",
  suppliers: "",
  price: "",
};

function mergeDefaults(d?: Partial<ProductFormValues>): ProductFormValues {
  return {
    ...EMPTY,
    ...d,
  };
}

export type ProductFormMode = "add" | "edit";

const TITLES: Record<ProductFormMode, string> = {
  add: "Add a new product",
  edit: "Edit product",
};

const SUBMIT_LABELS: Record<ProductFormMode, string> = {
  add: "Add",
  edit: "Save",
};

export type ProductFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: ProductFormMode;
  /** Для режиму редагування — початкові значення полів */
  defaultValues?: Partial<ProductFormValues>;
  onSubmit?: (values: ProductFormValues) => void;
};

export function ProductFormModal({
  open,
  onClose,
  mode,
  defaultValues,
  onSubmit,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormValues>(() =>
    mergeDefaults(defaultValues)
  );

  const patch = useCallback((key: keyof ProductFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={TITLES[mode]}
      footer={
        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            form="product-form"
            variant="primary"
            className="min-w-[133px] text-xs md:min-w-[133px] md:text-sm"
          >
            {SUBMIT_LABELS[mode]}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "inline-flex min-h-11 min-w-[133px] items-center justify-center rounded-full px-10 py-[13px]",
              "text-xs font-medium leading-[18px] text-muted md:text-sm",
              "bg-[rgb(29_30_33_/10%)] transition-colors",
              "hover:bg-[rgb(29_30_33_/15%)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            )}
          >
            Cancel
          </button>
        </div>
      }
    >
      <form
        id="product-form"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-2 md:gap-y-3.5"
        onSubmit={handleSubmit}
      >
        <div className="order-1 min-w-0 md:col-start-1 md:row-start-1">
          <Input
            id="product-info"
            name="productInfo"
            autoComplete="off"
            placeholder="Product Info"
            value={form.productInfo}
            onChange={(e) => patch("productInfo", e.target.value)}
          />
        </div>
        <div className="order-2 min-w-0 md:col-start-2 md:row-start-1">
          <Select
            id="product-category"
            name="category"
            aria-label="Category"
            options={PRODUCT_CATEGORY_OPTIONS}
            placeholder="Category"
            triggerVariant="subtle"
            value={form.category}
            onValueChange={(v) => patch("category", v)}
          />
        </div>
        <div className="order-4 min-w-0 md:col-start-1 md:row-start-2">
          <Input
            id="product-stock"
            name="stock"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => patch("stock", e.target.value)}
          />
        </div>
        <div className="order-3 min-w-0 md:col-start-2 md:row-start-2">
          <Input
            id="product-suppliers"
            name="suppliers"
            autoComplete="off"
            placeholder="Suppliers"
            value={form.suppliers}
            onChange={(e) => patch("suppliers", e.target.value)}
          />
        </div>
        <div className="order-5 min-w-0 md:col-start-1 md:row-start-3">
          <Input
            id="product-price"
            name="price"
            inputMode="decimal"
            autoComplete="off"
            placeholder="Price"
            value={form.price}
            onChange={(e) => patch("price", e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
