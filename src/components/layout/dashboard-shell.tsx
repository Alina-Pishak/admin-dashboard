"use client";

import { LogOut, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getUserInfoRequest, logoutUserRequest } from "@/lib/api";
import { clearStoredToken, getStoredToken } from "@/lib/auth";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar-nav";

type DashboardShellProps = {
  children: ReactNode;
  /** Заголовок у хедері (як «Medicine store» у Figma) */
  title?: string;
  /** Перший сегмент breadcrumb (напр. Dashboard) */
  breadcrumbCurrent?: string;
  /** Email у другому сегменті breadcrumb */
  userEmail?: string;
};

export function DashboardShell({
  children,
  title = "Medicine store",
  breadcrumbCurrent = "Dashboard",
  userEmail = "vendor@gmail.com",
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbCurrentResolved = useMemo(() => {
    const map: Record<string, string> = {
      "/": "Dashboard",
      "/orders": "All orders",
      "/products": "All products",
      "/suppliers": "All suppliers",
      "/customers": "All customers",
    };
    return map[pathname] ?? breadcrumbCurrent;
  }, [pathname, breadcrumbCurrent]);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [resolvedUserEmail, setResolvedUserEmail] = useState(userEmail);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    getUserInfoRequest(token)
      .then((user) => {
        setResolvedUserEmail(user.email || userEmail);
      })
      .catch(() => {
        setResolvedUserEmail(userEmail);
      });
  }, [userEmail]);

  function handleLogout() {
    void (async () => {
      const token = getStoredToken();
      if (token) {
        try {
          await logoutUserRequest(token);
        } catch {
          // мережева помилка — все одно виходимо локально
        }
      }
      clearStoredToken();
      router.push("/login");
      router.refresh();
    })();
  }

  return (
    <div className="flex min-h-full bg-surface-page">
      {/* Desktop / tablet: вузька колонка 80px + іконки */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-border-subtle bg-surface-page md:flex"
        aria-label="Бічна панель"
      >
        <div className="flex justify-center pt-[18px]">
          <Logo />
        </div>
        <div className="flex flex-1 flex-col pt-8">
          <SidebarNav variant="icons" />
        </div>
      </aside>

      {/* Mobile: overlay + drawer */}
      <div
        className={cnOverlay(mobileNavOpen)}
        aria-hidden={!mobileNavOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Закрити меню"
        />
        <div
          className={cnDrawer(mobileNavOpen)}
          id="mobile-dashboard-nav"
        >
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-4">
            <div className="flex items-center gap-3">
              <Logo className="size-9" />
              <span className="font-semibold text-foreground">{title}</span>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-muted hover:bg-surface-subtle hover:text-foreground"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Закрити"
            >
              <X className="size-5" />
            </button>
          </div>
          <SidebarNav
            variant="labeled"
            onNavigate={() => setMobileNavOpen(false)}
          />
        </div>
      </div>

      <div className="flex min-h-full flex-1 flex-col md:pl-20">
        <header className="sticky top-0 z-20 flex min-h-20 shrink-0 items-center gap-3 border-b border-border-subtle bg-surface-page px-4 py-3 md:px-8 md:py-0">
          <IconButton
            variant="ghost"
            className="size-8 min-h-8 min-w-8 shrink-0 md:hidden [&_svg]:size-[18px]"
            aria-label="Відкрити меню"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-dashboard-nav"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-[18px]" strokeWidth={1.75} />
          </IconButton>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Logo className="size-8 shrink-0 md:hidden" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold leading-6 text-foreground md:text-2xl md:leading-8">
                {title}
              </h1>
              <p className="truncate text-xs leading-[18px] text-muted">
                <span>{breadcrumbCurrentResolved}</span>
                <span className="mx-2 text-muted">|</span>
                <span>{resolvedUserEmail || userEmail}</span>
              </p>
            </div>
          </div>

          <IconButton
            variant="solid"
            className="shrink-0"
            aria-label="Вийти"
            onClick={handleLogout}
          >
            <LogOut className="size-5" strokeWidth={1.75} />
          </IconButton>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function cnOverlay(open: boolean) {
  return [
    "fixed inset-0 z-40 md:hidden",
    "transition-opacity duration-200",
    open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
  ].join(" ");
}

function cnDrawer(open: boolean) {
  return [
    "absolute left-0 top-0 flex h-full w-[min(18rem,85vw)] flex-col bg-surface-card shadow-xl transition-transform duration-200 ease-out md:hidden",
    open ? "translate-x-0" : "-translate-x-full",
  ].join(" ");
}
