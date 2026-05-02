import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "box-border h-11 w-full min-w-0 rounded-full border border-border-subtle bg-surface-card px-[18px] py-[13px] text-xs leading-[18px] text-foreground placeholder:text-muted",
        "transition-[color,box-shadow,border-color] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});
