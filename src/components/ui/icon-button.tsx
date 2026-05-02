"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Відповідає компонентам у Figma:
 * - `ghost` — Menu / навігація (1469:439): сіра іконка, легкий бордер, hover → зелена іконка + легкий м’ятний фон.
 * - `solid` — Logout / акцентна дія (1470:477): суцільне зелене коло, біла іконка, hover → темніший зелений (`primary-hover`).
 */
export type IconButtonVariant = "ghost" | "solid";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
}

const variantClass: Record<IconButtonVariant, string> = {
  ghost:
    "border border-border-subtle bg-transparent text-muted hover:border-primary hover:bg-primary-muted hover:text-primary disabled:pointer-events-none disabled:opacity-40",
  solid:
    "border border-transparent bg-primary text-white hover:bg-primary-hover hover:text-white disabled:pointer-events-none disabled:opacity-40",
};

export function IconButton({
  className,
  variant = "ghost",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page",
        variant === "ghost" && "focus-visible:ring-primary/35",
        variant === "solid" && "focus-visible:ring-white/90 focus-visible:ring-offset-primary",
        variantClass[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
