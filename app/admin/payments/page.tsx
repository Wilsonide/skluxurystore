/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  Loader2,
  Search,
} from "lucide-react";

import {
  PaymentService,
  type PaginatedPayments,
  type Payment,
} from "@/app/services/payment.service";

export default function AdminPaymentsPage() {
  const [data, setData] = useState<PaginatedPayments | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const pageSize = 20;

  const [search, setSearch] = useState("");

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await PaymentService.getAll({
        page,
        page_size: pageSize,
      });

      setData(result);
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchPayments());
  }, [fetchPayments]);

  const payments = data?.items ?? [];

  const filteredPayments = payments.filter((payment) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      payment.reference.toLowerCase().includes(query) ||
      String(payment.order_id).includes(query) ||
      payment.status.toLowerCase().includes(query)
    );
  });

  const formatAmount = (amount: string | number) => {
    return `₦${Number(amount).toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
      case "successful":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const hasPrevious = data?.page ? data.page > 1 : false;

  const hasNext = data ? data.page < data.total_pages : false;

  return (
    <main className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
            <CreditCard className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Payments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor customer payments and transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reference, order or status..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div className="text-sm text-slate-500">
          {data?.total ?? 0} total payments
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading payments...
            </div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="flex min-h-80 items-center justify-center px-6 text-center">
            <div>
              <CreditCard className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 font-semibold text-slate-900">
                No payments found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                There are no payments matching your search.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredPayments.map((payment: Payment) => (
                    <tr
                      key={payment.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="max-w-[240px] truncate text-sm font-semibold text-slate-900">
                          {payment.reference}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ID #{payment.id}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${payment.order_id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          #{payment.order_id}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {formatAmount(payment.amount)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                            payment.status,
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(payment.created_at)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/payments/${payment.id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y md:hidden">
              {filteredPayments.map((payment) => (
                <Link
                  key={payment.id}
                  href={`/admin/payments/${payment.id}`}
                  className="block p-5 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {payment.reference}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Order #{payment.order_id}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        payment.status,
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {formatAmount(payment.amount)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(payment.created_at)}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {data.page} of {data.total_pages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!hasPrevious || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              disabled={!hasNext || loading}
              onClick={() => setPage((current) => current + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
