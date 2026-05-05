"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IncomeExpensesCard } from "@/components/dashboard/income-expenses-card";
import { RecentCustomersTable } from "@/components/dashboard/recent-customers-table";
import { StatSummaryCards } from "@/components/dashboard/stat-summary-cards";
import {
  getDashboardRequest,
  mapDashboardCustomers,
  mapDashboardTransactions,
  type DashboardResponse,
} from "@/lib/api";
import { demoCustomers } from "@/lib/demo-table-data";
import { demoLedgerToday } from "@/lib/demo-ledger";
import { cn } from "@/lib/utils";

export function DashboardHomeClient() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      getDashboardRequest()
        .then((data) => {
          if (!cancelled) setDashboard(data);
        })
        .catch(() => {
          if (!cancelled) setDashboard(null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[1280px] space-y-4 md:space-y-6">
      {loading ? (
        <div
          className="absolute inset-0 z-10 flex min-h-[320px] items-center justify-center rounded-lg bg-surface-page/75 backdrop-blur-[2px] md:min-h-[380px]"
          role="status"
          aria-live="polite"
          aria-label="Loading dashboard"
        >
          <Loader2
            className="size-10 shrink-0 animate-spin text-primary"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      ) : null}
      <div
        className={cn(
          loading && "pointer-events-none select-none opacity-45",
        )}
      >
        <StatSummaryCards summary={dashboard?.summary} />
        <div className="grid grid-cols-1 gap-4 mt-5 md:mt-10 lg:grid-cols-2 lg:items-start lg:gap-5">
          <RecentCustomersTable
            data={
              dashboard?.lastClients
                ? mapDashboardCustomers(dashboard.lastClients)
                : demoCustomers.slice(0, 5)
            }
          />
          <IncomeExpensesCard
            rows={
              dashboard?.transactions
                ? mapDashboardTransactions(dashboard.transactions)
                : demoLedgerToday
            }
          />
        </div>
      </div>
    </div>
  );
}
