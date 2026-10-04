"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (item: T) => string | number;
}

export default function AdminDataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found.",
  rowKey,
}: AdminDataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                    column.className || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="h-40 text-center">
                  <Loader2
                    className="mx-auto animate-spin text-slate-400"
                    size={22}
                  />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-40 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={rowKey(item)} className="transition hover:bg-slate-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-5 py-4 text-sm text-slate-700"
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
