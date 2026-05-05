"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  DateInput,
  Input,
  Modal,
  Select,
  type SelectOption,
} from "@/components/ui";
import { supplierFormSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

/**
 * Форма постачальника — [десктоп 92:1187](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-1187),
 * [планшет 92:2959](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-2959),
 * [мобайл 92:4557](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-4557).
 */
export type SupplierFormValues = {
  name: string;
  address: string;
  company: string;
  deliveryDate: string;
  amount: string;
  status: string;
};

export const SUPPLIER_STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const EMPTY: SupplierFormValues = {
  name: "",
  address: "",
  company: "",
  deliveryDate: "",
  amount: "",
  status: "",
};

function mergeDefaults(d?: Partial<SupplierFormValues>): SupplierFormValues {
  return {
    ...EMPTY,
    ...d,
  };
}

export type SupplierFormMode = "add" | "edit";

const TITLES: Record<SupplierFormMode, string> = {
  add: "Add a new suppliers",
  edit: "Edit supplier",
};

const SUBMIT_LABELS: Record<SupplierFormMode, string> = {
  add: "Add",
  edit: "Save",
};

export type SupplierFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: SupplierFormMode;
  defaultValues?: Partial<SupplierFormValues>;
  onSubmit?: (values: SupplierFormValues) => void | Promise<void>;
};

export function SupplierFormModal({
  open,
  onClose,
  mode,
  defaultValues,
  onSubmit,
}: SupplierFormModalProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: yupResolver(supplierFormSchema),
    defaultValues: mergeDefaults(defaultValues),
  });

  const submit = async (values: SupplierFormValues) => {
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
            form="supplier-form"
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
        id="supplier-form"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-2 md:gap-y-3.5"
        onSubmit={handleSubmit(submit)}
      >
        <div className="min-w-0 md:col-start-1 md:row-start-1">
          <Input
            id="supplier-info"
            autoComplete="off"
            placeholder="Suppliers Info"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="min-w-0 md:col-start-2 md:row-start-1">
          <Input
            id="supplier-address"
            autoComplete="street-address"
            placeholder="Address"
            {...register("address")}
          />
          {errors.address ? (
            <p className="mt-1 text-xs text-danger">{errors.address.message}</p>
          ) : null}
        </div>
        <div className="min-w-0 md:col-start-1 md:row-start-2">
          <Input
            id="supplier-company"
            autoComplete="organization"
            placeholder="Company"
            {...register("company")}
          />
          {errors.company ? (
            <p className="mt-1 text-xs text-danger">{errors.company.message}</p>
          ) : null}
        </div>
        <div className="min-w-0 md:col-start-2 md:row-start-2">
          <Controller
            name="deliveryDate"
            control={control}
            render={({ field }) => (
              <DateInput
                id="supplier-delivery-date"
                name={field.name}
                aria-label="Delivery date"
                placeholder="Delivery date"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.deliveryDate ? (
            <p className="mt-1 text-xs text-danger">
              {errors.deliveryDate.message}
            </p>
          ) : null}
        </div>
        <div className="min-w-0 md:col-start-1 md:row-start-3">
          <Input
            id="supplier-amount"
            inputMode="decimal"
            autoComplete="off"
            placeholder="Ammount"
            {...register("amount")}
          />
          {errors.amount ? (
            <p className="mt-1 text-xs text-danger">{errors.amount.message}</p>
          ) : null}
        </div>
        <div className="min-w-0 md:col-start-2 md:row-start-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                id="supplier-status"
                name={field.name}
                aria-label="Status"
                options={SUPPLIER_STATUS_OPTIONS}
                placeholder="Status"
                triggerVariant="subtle"
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
          {errors.status ? (
            <p className="mt-1 text-xs text-danger">{errors.status.message}</p>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}
