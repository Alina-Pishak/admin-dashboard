"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:pointer-events-none disabled:bg-[rgb(29_30_33_/10%)] disabled:text-muted",
  outline:
    "border border-primary border-solid bg-surface-card text-primary hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:border-transparent disabled:bg-[rgb(29_30_33_/10%)] disabled:text-muted disabled:hover:bg-[rgb(29_30_33_/10%)]",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 min-w-[133px] items-center justify-center rounded-full px-10 py-[13px] text-sm font-medium leading-[18px] transition-colors",
        variantClass[variant],
        className
      )}
      {...props}
    />
  );
}
