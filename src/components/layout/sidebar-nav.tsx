"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarNavProps = {
  /** У drawer показуємо підписи поруч із іконками */
  variant?: "icons" | "labeled";
  onNavigate?: () => void;
};

export function SidebarNav({
  variant = "icons",
  onNavigate,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-col",
        variant === "icons"
          ? "items-center gap-3.5"
          : "gap-1 px-3 pb-6 pt-2"
      )}
      aria-label="Головна навігація"
    >
      {dashboardNav.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);

        if (variant === "labeled") {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-muted text-primary"
                  : "text-muted hover:bg-surface-subtle hover:text-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={item.label}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
              active
                ? "border-primary bg-primary-muted text-primary"
                : "border-border-subtle bg-transparent text-muted hover:border-primary hover:bg-primary-muted hover:text-primary"
            )}
          >
            <Icon className="size-5" strokeWidth={1.75} aria-hidden />
          </Link>
        );
      })}
    </nav>
  );
}
