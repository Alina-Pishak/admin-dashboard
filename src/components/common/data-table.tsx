"use client";

import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  title: string;
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T, index: number) => string;
  toolbar?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  emptyText?: string;
  total?: number;
  page?: number;
  totalPages?: number;
};

export function DataTable<T>({
  title,
  data,
  columns,
  getRowKey,
  toolbar,
  isLoading = false,
  isError = false,
  errorText = "Request failed. Check API connection.",
  emptyText = "No records yet.",
  total,
  page = 1,
  totalPages = 5,
}: DataTableProps<T>) {
  const pages = Math.max(1, totalPages);
  const currentPage = Math.min(Math.max(1, page), pages);

  return (
    <div className="space-y-4">
      {toolbar ? <div className="flex flex-wrap items-center gap-3">{toolbar}</div> : null}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between bg-secondary px-4 py-4 md:px-5">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <span className="text-sm text-muted-foreground">
            Total: {total ?? data.length}
          </span>
        </div>

        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "border-b border-border bg-card px-4 py-3 text-left text-sm font-medium text-muted-foreground",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="px-4 py-4 text-sm text-muted-foreground"
                  colSpan={columns.length}
                >
                  Loading data...
                </td>
              </tr>
            ) : null}

            {isError ? (
              <tr>
                <td
                  className="px-4 py-4 text-sm text-destructive"
                  colSpan={columns.length}
                >
                  {errorText}
                </td>
              </tr>
            ) : null}

            {!isLoading && !isError && data.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-4 text-sm text-muted-foreground"
                  colSpan={columns.length}
                >
                  {emptyText}
                </td>
              </tr>
            ) : null}

            {!isLoading && !isError
              ? data.map((row, index) => (
                  <tr key={getRowKey(row, index)}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "border-t border-border px-4 py-4 text-sm text-foreground",
                          column.cellClassName
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: pages }).map((_, index) => {
          const dotPage = index + 1;
          const active = dotPage === currentPage;

          return (
            <span
              key={dotPage}
              className={cn(
                "size-2 rounded-full",
                active ? "bg-primary" : "bg-border"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
