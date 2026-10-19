import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  header: string;
  /** Render the cell. Receives the row. */
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

/** Minimal generic table used across every dashboard list screen. */
export function DataTable<T>({ columns, rows, getRowKey, onRowClick, emptyMessage }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState message={emptyMessage ?? "No records to show."} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-black/5 bg-white">
      <table className="w-full min-w-max text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 bg-surface/60">
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-semibold text-muted">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-black/5 last:border-0",
                onRowClick && "cursor-pointer transition-colors hover:bg-surface/60",
              )}
            >
              {columns.map((col) => (
                <td key={col.header} className={cn("px-4 py-3 align-middle text-ink", col.className)}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
