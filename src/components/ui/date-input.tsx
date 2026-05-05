"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** `YYYY-MM-DD` у локальній зоні (без UTC зсуву) */
export function dateToIsoLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function parseIsoLocal(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const day = Number(m[3]);
  const d = new Date(y, mo, day);
  if (
    d.getFullYear() !== y ||
    d.getMonth() !== mo ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthCells(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export type DateInputProps = {
  /** `YYYY-MM-DD` */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  "aria-label"?: string;
};

/**
 * Поле дати з іконкою календаря (primary), як **Delivery date** у [формі suppliers 92:1187](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-1187).
 * Випадаючий календар стилізовано під поточні токени (`primary`, `surface-card`, `border-subtle`).
 */
export function DateInput({
  value: valueProp,
  defaultValue = "",
  onChange,
  placeholder = "Delivery date",
  disabled,
  className,
  name,
  id,
  "aria-label": ariaLabel,
}: DateInputProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const gridId = `${triggerId}-calendar`;

  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const selectedIso = controlled ? valueProp! : uncontrolled;

  const setIso = useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next);
      onChange?.(next);
    },
    [controlled, onChange]
  );

  const selectedDate = useMemo(
    () => (selectedIso ? parseIsoLocal(selectedIso) : null),
    [selectedIso]
  );

  const [view, setView] = useState(() => {
    const d = selectedDate ?? new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const openPicker = useCallback(() => {
    const base = selectedDate ?? new Date();
    setView({ y: base.getFullYear(), m: base.getMonth() });
    setOpen(true);
  }, [selectedDate]);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const w = Math.min(Math.max(r.width, 288), window.innerWidth - 16);
    const leftRaw = r.left + r.width - w;
    const left = Math.max(8, Math.min(leftRaw, window.innerWidth - w - 8));
    const estH = 320;
    let top = r.bottom + 4;
    if (top + estH > window.innerHeight) {
      top = Math.max(8, r.top - estH - 4);
    }
    setCoords({ top, left, width: w });
  }, []);

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
      if (popoverRef.current?.contains(t)) return;
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

  const displayText = useMemo(() => {
    if (!selectedIso || !selectedDate) return "";
    return selectedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [selectedIso, selectedDate]);

  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const cells = useMemo(
    () => buildMonthCells(view.y, view.m),
    [view.y, view.m]
  );

  const monthLabel = useMemo(() => {
    return new Date(view.y, view.m, 1).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  }, [view.y, view.m]);

  const pickDay = (day: number) => {
    const d = new Date(view.y, view.m, day);
    setIso(dateToIsoLocal(d));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) openPicker();
      else setOpen(false);
    }
    if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      openPicker();
    }
  };

  const popover =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={popoverRef}
            id={gridId}
            role="dialog"
            aria-modal="true"
            aria-label="Calendar"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className={cn(
              "z-[60] rounded-[15px] border border-border-subtle bg-surface-card p-3 shadow-lg",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            )}
            tabIndex={-1}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label="Previous month"
                onClick={() => shiftMonth(-1)}
              >
                <ChevronLeft className="size-4" strokeWidth={2} />
              </button>
              <span className="min-w-0 flex-1 text-center text-sm font-semibold capitalize text-foreground">
                {monthLabel}
              </span>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
              >
                <ChevronRight className="size-4" strokeWidth={2} />
              </button>
            </div>
            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((wd) => (
                <div
                  key={wd}
                  className="text-center text-[10px] font-medium uppercase tracking-wide text-muted"
                >
                  {wd}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day == null) {
                  return <div key={`e-${i}`} className="size-9" />;
                }
                const cellDate = new Date(view.y, view.m, day);
                const isSel =
                  selectedDate != null && sameDay(cellDate, selectedDate);
                const isToday = sameDay(cellDate, today);
                return (
                  <button
                    key={`${view.y}-${view.m}-${day}-${i}`}
                    type="button"
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-full text-xs font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      isSel
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-primary-muted",
                      !isSel && isToday && "font-semibold text-primary"
                    )}
                    onClick={() => pickDay(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      {name ? (
        <input type="hidden" name={name} value={selectedIso} readOnly />
      ) : null}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? gridId : undefined}
        aria-label={ariaLabel}
        className={cn(
          "box-border flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-full border border-border-subtle bg-surface-card px-[18px] py-[13px] text-left text-xs leading-[18px]",
          displayText ? "text-foreground/80" : "text-muted",
          "transition-[color,box-shadow,border-color]",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
        onClick={() => !disabled && (open ? setOpen(false) : openPicker())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="min-w-0 flex-1 truncate">
          {displayText || placeholder}
        </span>
        <Calendar
          className="size-4 shrink-0 text-primary"
          strokeWidth={1.75}
          aria-hidden
        />
      </button>
      {popover}
    </div>
  );
}
