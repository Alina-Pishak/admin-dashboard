import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "completed"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "processing";

const variantClass: Record<BadgeVariant, string> = {
  completed: "bg-primary-muted text-primary",
  confirmed: "bg-status-confirmed-muted text-status-confirmed",
  pending: "bg-status-pending-muted text-status-pending",
  cancelled: "bg-danger-muted text-danger",
  processing: "bg-status-processing-muted text-status-processing",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-[28px] items-center justify-center rounded-[40px] px-3 py-1 text-sm font-medium tracking-[-0.035em]",
        variantClass[variant],
        className
      )}
      {...props}
    />
  );
}
