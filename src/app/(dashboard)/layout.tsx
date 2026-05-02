import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardGroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
