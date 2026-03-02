"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
};

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/orders", label: "All Orders" },
  { href: "/products", label: "All Products" },
  { href: "/customers", label: "All Customers" },
  { href: "/suppliers", label: "All Suppliers" },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="app-container grid gap-6 py-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Admin Panel
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-xl px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section>{children}</section>
      </div>
    </div>
  );
}
