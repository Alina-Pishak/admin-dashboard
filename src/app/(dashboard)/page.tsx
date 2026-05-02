import { IncomeExpensesCard } from "@/components/dashboard/income-expenses-card";
import { RecentCustomersTable } from "@/components/dashboard/recent-customers-table";
import { StatSummaryCards } from "@/components/dashboard/stat-summary-cards";

/**
 * Dashboard — [десктоп 0:76](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=0-76),
 * [планшет 1:187](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=1-187),
 * [мобайл 20:6602](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=20-6602).
 */
export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-4 md:space-y-6">
      <StatSummaryCards />
      <div className="grid grid-cols-1 gap-4 mt-5 md:mt-10 lg:grid-cols-2 lg:items-start lg:gap-5">
        <RecentCustomersTable />
        <IncomeExpensesCard />
      </div>
    </div>
  );
}
