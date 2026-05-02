"use client";

import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectTriggerVariant = "accent" | "subtle";

export type SelectProps = {
  options: SelectOption[];
  /** Кероване значення */
  value?: string;
  /** Початкове значення (некерований режим) */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * `accent` — зелена обводка (модалка Edit product).
   * `subtle` — сіра як у `Input` [Add product 92:804].
   */
  triggerVariant?: SelectTriggerVariant;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Для відправки форми */
  name?: string;
  id?: string;
  /** Якщо немає видимого `<Label htmlFor=…>` */
  "aria-label"?: string;
};

/**
 * Кастомний дропдаун за [макетом Edit product / планшет](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-2637):
 * тригер — pill, обводка `rgb(89 177 122 / 40%)`; меню — `bg-primary`, `rounded-[15px]`,
 * активний пункт — білий текст, інші — `white/50`; тонкий світлий скролбар.
 */
const triggerVariantClass: Record<SelectTriggerVariant, string> = {
  accent:
    "border border-[rgb(89_177_122_/40%)] focus:border-primary focus:ring-primary/15",
  subtle: "border border-border-subtle focus:border-primary focus:ring-primary/15",
};

export function Select({
  options,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  triggerVariant = "accent",
  placeholder = "Select…",
  disabled,
  className,
  name,
  id,
  "aria-label": ariaLabel,
}: SelectProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const selectedValue = controlled ? valueProp! : uncontrolled;

  const setSelected = useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange]
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const selectedLabel = useMemo(() => {
    const opt = options.find((o) => o.value === selectedValue);
    return opt?.label ?? "";
  }, [options, selectedValue]);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({
      top: r.bottom + 4,
      left: r.left,
      width: r.width,
    });
  }, []);

  const openMenu = useCallback(() => {
    const idx = options.findIndex((o) => o.value === selectedValue);
    setHighlightedIndex(idx >= 0 ? idx : 0);
    setOpen(true);
  }, [options, selectedValue]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updatePosition)
        : null;
    if (triggerRef.current && ro) ro.observe(triggerRef.current);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      ro?.disconnect();
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectIndex = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt) return;
      setSelected(opt.value);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [options, setSelected]
  );

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) selectIndex(highlightedIndex);
      else openMenu();
    }
  };

  const listKeyboard = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectIndex(highlightedIndex);
    }
  };

  const menu =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className={cn(
              "select-menu-scroll z-[60] max-h-[140px] overflow-y-auto rounded-[15px] bg-primary py-2 shadow-lg",
              "outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            )}
            onKeyDown={listKeyboard}
          >
            {options.map((opt, index) => {
              const selected = opt.value === selectedValue;
              const highlighted = index === highlightedIndex;
              return (
                <div
                  key={opt.value}
                  id={`${listboxId}-opt-${index}`}
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "cursor-pointer px-[18px] py-1.5 text-xs leading-[18px] transition-colors",
                    selected
                      ? "text-white"
                      : "text-white/50 hover:text-white/80",
                    highlighted && "bg-white/10"
                  )}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    selectIndex(index);
                  }}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>,
          document.body
        )
      : null;

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      {name ? (
        <input type="hidden" name={name} value={selectedValue} readOnly />
      ) : null}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled || options.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        className={cn(
          "flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-full border bg-surface-card px-[18px] text-left text-xs leading-[18px]",
          triggerVariantClass[triggerVariant],
          selectedLabel
            ? "text-[rgb(29_30_33_/80%)]"
            : "text-muted",
          "transition-[border-color,box-shadow,color]",
          "focus:outline-none focus:ring-2",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
        onClick={() => {
          if (disabled || options.length === 0) return;
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="min-w-0 flex-1 truncate">
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
          strokeWidth={2}
          aria-hidden
        />
      </button>
      {menu}
    </div>
  );
}
