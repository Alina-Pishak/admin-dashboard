"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Заголовок діалогу (напр. «Edit product» / «Edit data» у макетах) */
  title: ReactNode;
  /** Основний вміст */
  children: ReactNode;
  /** Нижня зона дій (кнопки Save / Cancel тощо) — опційно */
  footer?: ReactNode;
  /** Закриття по кліку на затемнення (за замовчуванням увімкнено) */
  closeOnBackdropClick?: boolean;
  className?: string;
  /** Додаткові класи для панелі (ширина, max-height) */
  panelClassName?: string;
};

/**
 * Універсальна модалка за референсами Figma:
 * десктоп [92:1011], планшет [92:2637], мобайл [92:4273] — білий контейнер,
 * `rounded-[12px]`, заголовок + хрестик, адаптивні відступи.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnBackdropClick = true,
  className,
  panelClassName,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={cn("fixed inset-0 z-50", className)} role="presentation">
      <div
        className="absolute inset-0 bg-[rgb(29_30_33_/45%)]"
        aria-hidden
        onPointerDown={() => {
          if (closeOnBackdropClick) onClose();
        }}
      />
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="pointer-events-auto relative w-full max-w-[min(100%,335px)] sm:max-w-[min(100%,536px)]">
          <div
            className={cn(
              "bg-surface-card shadow-[0_8px_40px_rgb(29_30_33_/12%)]",
              "flex max-h-[min(100dvh-2rem,900px)] min-h-0 w-full flex-col overflow-hidden rounded-[12px]",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              "sm:max-h-[min(100dvh-3rem,900px)]",
              panelClassName
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            ref={panelRef}
          >
          <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5 md:px-10 md:pt-10">
            <h2
              id={titleId}
              className="min-w-0 flex-1 font-semibold leading-7 text-foreground text-xl md:text-2xl md:leading-8"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "-m-1.5 shrink-0 rounded-full p-1.5 text-foreground transition-colors",
                "hover:bg-primary-muted hover:text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
              )}
              aria-label="Закрити"
            >
              <X className="size-6 md:size-[26px]" strokeWidth={2} aria-hidden />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 md:px-10 md:pb-10 md:pt-6">
            {children}
          </div>

          {footer != null ? (
            <div className="shrink-0 px-5 pb-5 pt-2 md:px-10 md:pb-10 md:pt-0">
              {footer}
            </div>
          ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
