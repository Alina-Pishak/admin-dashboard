"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Input,
  Modal,
  Select,
  type SelectOption,
} from "@/components/ui";
import { productFormSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

/** Поля форми продукту — [Add / Edit product](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-804) */
export type ProductFormValues = {
  name: string;
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
  name: "",
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
  onSubmit?: (values: ProductFormValues) => void | Promise<void>;
};

export function ProductFormModal({
  open,
  onClose,
  mode,
  defaultValues,
  onSubmit,
}: ProductFormModalProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productFormSchema),
    defaultValues: mergeDefaults(defaultValues),
  });

  const submit = async (values: ProductFormValues) => {
    await onSubmit?.(values);
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
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
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
        onSubmit={handleSubmit(submit)}
      >
        <div className="order-1 min-w-0 md:col-start-1 md:row-start-1">
          <Input
            id="product-info"
            autoComplete="off"
            placeholder="Product Info"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="order-2 min-w-0 md:col-start-2 md:row-start-1">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                id="product-category"
                name={field.name}
                aria-label="Category"
                options={PRODUCT_CATEGORY_OPTIONS}
                placeholder="Category"
                triggerVariant="subtle"
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
          {errors.category ? (
            <p className="mt-1 text-xs text-danger">
              {errors.category.message}
            </p>
          ) : null}
        </div>
        <div className="order-4 min-w-0 md:col-start-1 md:row-start-2">
          <Input
            id="product-stock"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Stock"
            {...register("stock")}
          />
          {errors.stock ? (
            <p className="mt-1 text-xs text-danger">{errors.stock.message}</p>
          ) : null}
        </div>
        <div className="order-3 min-w-0 md:col-start-2 md:row-start-2">
          <Input
            id="product-suppliers"
            autoComplete="off"
            placeholder="Suppliers"
            {...register("suppliers")}
          />
          {errors.suppliers ? (
            <p className="mt-1 text-xs text-danger">
              {errors.suppliers.message}
            </p>
          ) : null}
        </div>
        <div className="order-5 min-w-0 md:col-start-1 md:row-start-3">
          <Input
            id="product-price"
            inputMode="decimal"
            autoComplete="off"
            placeholder="Price"
            {...register("price")}
          />
          {errors.price ? (
            <p className="mt-1 text-xs text-danger">{errors.price.message}</p>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}
