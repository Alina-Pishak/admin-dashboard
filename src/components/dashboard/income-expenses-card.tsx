import { cn } from "@/lib/utils";
import { demoLedgerToday, type LedgerRow } from "@/lib/demo-ledger";

function KindPill({ kind }: { kind: LedgerRow["kind"] }) {
  if (kind === "income") {
    return (
      <span
        className={cn(
          "inline-flex min-w-[80px] justify-center rounded-[40px] px-1 py-1",
          "bg-primary-muted text-sm font-medium tracking-[-0.7px] text-primary"
        )}
      >
        Income
      </span>
    );
  }
  if (kind === "expense") {
    return (
      <span
        className={cn(
          "inline-flex min-w-[80px] justify-center rounded-[40px] px-1 py-1",
          "bg-danger-muted text-sm font-medium tracking-[-0.7px] text-danger"
        )}
      >
        Expense
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex min-w-[80px] justify-center rounded-[40px] px-1 py-1",
        "bg-[rgb(29_30_33_/10%)] text-sm font-medium tracking-[-0.7px] text-foreground"
      )}
    >
      Error
    </span>
  );
}

function AmountCell({ row }: { row: LedgerRow }) {
  const income = row.kind === "income" && !row.strikethrough;
  const expense = row.kind === "expense";
  const err = row.kind === "error";

  return (
    <span
      className={cn(
        "shrink-0 text-base font-medium tabular-nums",
        income && "text-primary",
        expense && "text-danger",
        err && "text-foreground",
        row.strikethrough && "line-through decoration-solid"
      )}
    >
      {row.amount}
    </span>
  );
}

export function IncomeExpensesCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-card shadow-[0_-1px_5px_0_rgba(71,71,71,0.05)]">
      <div
        className={cn(
          "flex min-h-12 items-center bg-surface-mint px-[13px] py-3 md:min-h-16 md:px-5",
          "md:py-0"
        )}
      >
        <h2 className="text-base font-semibold leading-6 text-foreground md:text-lg">
          Income/Expenses
        </h2>
      </div>
      <div className="border-b border-border-subtle px-[13px] py-3 md:px-5">
        <p className="text-sm font-medium text-muted">Today</p>
      </div>
      <div className="divide-y divide-border-subtle px-[13px] md:px-5">
        {demoLedgerToday.map((row) => (
          <div
            key={row.id}
            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-10">
              <KindPill kind={row.kind} />
              <p className="min-w-0 text-base font-medium leading-[18px] text-foreground">
                {row.description}
              </p>
            </div>
            <AmountCell row={row} />
          </div>
        ))}
      </div>
    </div>
  );
}
