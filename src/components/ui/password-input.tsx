"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div className={cn("relative w-full min-w-0", className)}>
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            "box-border h-11 w-full rounded-full border border-border-subtle bg-surface-card py-[13px] pl-[18px] pr-12 text-xs leading-[18px] text-foreground placeholder:text-muted",
            "transition-[color,box-shadow,border-color] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
          {...props}
        />
        <button
          type="button"
          className="absolute right-[13px] top-1/2 -translate-y-1/2 rounded-md p-0.5 text-foreground transition-colors hover:text-primary"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? "Приховати пароль" : "Показати пароль"}
        >
          {visible ? (
            <EyeOff className="size-[18px]" aria-hidden />
          ) : (
            <Eye className="size-[18px]" aria-hidden />
          )}
        </button>
      </div>
    );
  }
);
