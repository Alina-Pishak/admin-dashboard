"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
  type PaginationState,
} from "@tanstack/react-table";
import { Filter } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableLoadingOverlay } from "@/components/ui/table-loading-overlay";
import { cn } from "@/lib/utils";

export type DataTableVariant = "full" | "embedded";

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  /** Заголовок зеленої смуги картки */
  title: string;
  /** full — пошук, Filter, крапки пагінації (сторінки списків); embedded — лише таблиця (дашборд) */
  variant?: DataTableVariant;
  searchPlaceholder?: string;
  pageSize?: number;
  /**
   * Текст для глобального фільтра (напр. лише ім’я замовника).
   * Якщо не задано — TanStack шукає по всьому рядку (includesString).
   */
  getGlobalFilterText?: (row: TData) => string;
  /** Після застосування фільтра (кнопка / Enter) */
  onFilterApply?: (query: string) => void;
  /** Кнопки праворуч від тулбару (напр. «Add a new product») */
  toolbarEnd?: ReactNode;
  /** Підпис поля пошуку для a11y */
  searchAriaLabel?: string;
  /** Дані для колонок (`table.options.meta`, напр. колбеки дій) */
  meta?: unknown;
  emptyMessage?: string;
  className?: string;
  /** Оверлей зі спінером поверх картки таблиці */
  isLoading?: boolean;
};

export function DataTable<TData>({
  columns,
  data,
  title,
  variant = "full",
  searchPlaceholder = "User Name",
  pageSize = 5,
  getGlobalFilterText,
  onFilterApply,
  toolbarEnd,
  searchAriaLabel = "Пошук у таблиці",
  meta,
  emptyMessage = "Немає даних",
  className,
  isLoading = false,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  /** Чернетка в полі; у таблицю потрапляє лише після Filter / Enter */
  const [searchDraft, setSearchDraft] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const isFull = variant === "full";

  const globalFilterFn = useMemo<FilterFn<TData> | undefined>(() => {
    if (!getGlobalFilterText) return undefined;
    return (row, _columnId, filterValue) => {
      const q = String(filterValue).toLowerCase().trim();
      if (!q) return true;
      return getGlobalFilterText(row.original)
        .toLowerCase()
        .includes(q);
    };
  }, [getGlobalFilterText]);

  const applySearch = useCallback(() => {
    const q = searchDraft.trim();
    setGlobalFilter(q);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    onFilterApply?.(q);
  }, [searchDraft, onFilterApply]);

  /* eslint-disable-next-line react-hooks/incompatible-library -- useReactTable від TanStack */
  const table = useReactTable({
    data,
    columns,
    meta: meta as never,
    state: isFull
      ? {
          globalFilter,
          pagination,
        }
      : undefined,
    onGlobalFilterChange: isFull ? setGlobalFilter : undefined,
    onPaginationChange: isFull ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: isFull ? getFilteredRowModel() : undefined,
    getPaginationRowModel: isFull ? getPaginationRowModel() : undefined,
    globalFilterFn: globalFilterFn ?? "includesString",
  });

  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();

  const headerPadding = "px-[13px] py-3 md:px-5";
  const cellText = "text-xs md:text-base";
  const headerText =
    "text-left text-xs font-medium text-muted md:text-sm [&:last-child]:pr-5";
  const verticalRule =
    "border-r border-border-subtle last:border-r-0";

  const tableInner = (
    <table className="w-full min-w-[640px] border-collapse caption-bottom">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="border-b border-border-subtle bg-surface-card"
          >
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={cn(headerPadding, headerText, verticalRule)}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              className="text-muted px-5 py-8 text-center text-sm"
              colSpan={columns.length}
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border-subtle last:border-b-0"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={cn(
                    headerPadding,
                    cellText,
                    verticalRule,
                    "align-middle font-medium text-foreground"
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div className={cn("w-full max-w-full", className)}>
      {isFull && (
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Input
              placeholder={searchPlaceholder}
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applySearch();
                }
              }}
              className="shadow-[0_-1px_5px_0_rgba(71,71,71,0.05)] sm:flex-1 md:max-w-56"
              aria-label={searchAriaLabel}
            />
            <Button
              type="button"
              variant="primary"
              className="inline-flex shrink-0 gap-2 px-[30px] text-xs md:text-sm"
              onClick={applySearch}
              aria-label="Застосувати фільтр"
            >
              <Filter className="size-3.5 text-white" strokeWidth={2} aria-hidden />
              Filter
            </Button>
          </div>
          {toolbarEnd ? (
            <div className="flex shrink-0 items-center lg:justify-end">
              {toolbarEnd}
            </div>
          ) : null}
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg border border-border-subtle bg-surface-card shadow-[0_-1px_5px_0_rgba(71,71,71,0.05)]">
        {isLoading ? <TableLoadingOverlay /> : null}
        <div
          className={cn(
            "flex items-center bg-surface-mint px-[13px] py-3 md:min-h-16 md:px-5",
            "min-h-12 md:py-0",
            isLoading && "pointer-events-none opacity-60",
          )}
        >
          <h2 className="text-base font-semibold leading-5 text-foreground md:text-lg md:leading-6">
            {title}
          </h2>
        </div>
        <div
          className={cn(
            "overflow-x-auto",
            isLoading && "pointer-events-none opacity-60",
          )}
        >
          {tableInner}
        </div>
      </div>

      {isFull && pageCount > 1 && (
        <div
          className="flex justify-center gap-2 pt-4"
          role="navigation"
          aria-label="Сторінки"
        >
          {Array.from({ length: pageCount }, (_, i) => {
            const active = table.getState().pagination.pageIndex === i;
            return (
              <button
                key={i}
                type="button"
                className={cn(
                  "rounded-full transition-all",
                  active
                    ? "size-[12px] bg-primary"
                    : "size-[9px] bg-[#e6e6e6] hover:bg-border"
                )}
                aria-label={`Сторінка ${i + 1}`}
                aria-current={active ? "page" : undefined}
                onClick={() => table.setPageIndex(i)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
