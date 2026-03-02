type ResourceListProps = {
  title: string;
  isLoading: boolean;
  isError: boolean;
  total?: number;
  rows: string[];
};

export function ResourceList({
  title,
  isLoading,
  isError,
  total = 0,
  rows,
}: ResourceListProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">Total: {total}</span>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading data...</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Request failed. Check `NEXT_PUBLIC_API_URL` and backend status.
        </p>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No records yet.</p>
      )}

      {!isLoading && !isError && rows.length > 0 && (
        <ul className="space-y-2 text-sm">
          {rows.map((row) => (
            <li key={row} className="rounded-xl border border-border px-3 py-2">
              {row}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
