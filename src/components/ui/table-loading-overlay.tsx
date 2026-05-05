"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TableLoadingOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-[1] flex items-center justify-center rounded-[inherit] bg-surface-card/80 backdrop-blur-[2px]",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <Loader2
        className="size-9 shrink-0 animate-spin text-primary"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );
}
