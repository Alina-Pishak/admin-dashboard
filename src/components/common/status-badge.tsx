import { cn } from "@/lib/utils";

export type StatusTone =
  | "completed"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "processing";

type StatusBadgeProps = {
  tone: StatusTone;
  label?: string;
  className?: string;
};

const statusStyles: Record<StatusTone, { text: string; bg: string }> = {
  completed: {
    text: "var(--status-completed)",
    bg: "var(--status-completed-bg)",
  },
  confirmed: {
    text: "var(--status-confirmed)",
    bg: "var(--status-confirmed-bg)",
  },
  pending: {
    text: "var(--status-pending)",
    bg: "var(--status-pending-bg)",
  },
  cancelled: {
    text: "var(--status-cancelled)",
    bg: "var(--status-cancelled-bg)",
  },
  processing: {
    text: "var(--status-processing)",
    bg: "var(--status-processing-bg)",
  },
};

export function StatusBadge({ tone, label, className }: StatusBadgeProps) {
  const style = statusStyles[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium",
        className
      )}
      style={{
        color: style.text,
        backgroundColor: style.bg,
      }}
    >
      {label ?? tone}
    </span>
  );
}
