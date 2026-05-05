"use client";

import { Button, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";

export type DeleteProductConfirmModalProps = {
  open: boolean;
  productName: string;
  pending?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export function DeleteProductConfirmModal({
  open,
  productName,
  pending = false,
  onClose,
  onConfirm,
}: DeleteProductConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdropClick={!pending}
      closeDisabled={pending}
      title="Delete product?"
      footer={
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="min-w-[120px]"
            disabled={pending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void onConfirm()}
            className={cn(
              "inline-flex min-h-11 min-w-[133px] items-center justify-center rounded-full px-10 py-[13px] text-sm font-medium leading-[18px] transition-colors",
              "border border-danger bg-danger text-white",
              "hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-foreground">
        This will permanently remove{" "}
        <span className="font-semibold text-foreground">{productName}</span> from
        the catalog. This action cannot be undone.
      </p>
    </Modal>
  );
}
