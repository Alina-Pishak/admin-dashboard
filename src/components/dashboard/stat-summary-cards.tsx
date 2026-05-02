import Link from "next/link";
import { Coins, Package, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
  {
    href: "/products",
    label: "All products",
    value: "8,430",
    icon: Coins,
    highlight: true,
  },
  {
    href: "/suppliers",
    label: "All suppliers",
    value: "211",
    icon: Package,
    highlight: false,
  },
  {
    href: "/customers",
    label: "All customers",
    value: "140",
    icon: Users,
    highlight: false,
  },
] as const;

export function StatSummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STATS.map(({ href, label, value, icon: Icon, highlight }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "rounded-lg border bg-surface-card px-[18px] py-3.5 shadow-[0_-1px_5px_0_rgba(71,71,71,0.05)] transition-colors",
            "hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
            highlight ? "border-primary" : "border-border-subtle"
          )}
        >
          <div className="flex flex-col gap-7">
            <div className="flex items-center gap-2">
              <Icon
                className="size-5 shrink-0 text-foreground"
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="text-xs leading-[18px] text-muted">{label}</span>
            </div>
            <p className="text-2xl font-semibold leading-8 text-foreground">
              {value}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
