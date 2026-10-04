/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";

import { OrderService } from "@/app/services/order.service";

import type { Order, PaginatedOrders } from "@/app/types/order";

function formatCurrency(value: string | number) {
  return `₦${Number(value).toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusClass(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "DELIVERED":
      return "bg-green-50 text-green-700";

    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "PROCESSING":
      return "bg-blue-50 text-blue-700";

    case "CANCELLED":
    case "CANCELED":
      return "bg-red-50 text-red-700";

    case "SHIPPED":
      return "bg-purple-50 text-purple-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function AccountOrdersPage() {
  const [data, setData] = useState<PaginatedOrders | null>(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const pageSize = 10;

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await OrderService.getMyOrders({
        page,
        page_size: pageSize,
      });

      setData(result);
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void Promise.resolve().then(() => loadOrders());
  }, [loadOrders]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          My Account
        </Link>

        {/* Header */}
        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View your order history and track your purchases.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && data?.items.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Package className="h-7 w-7 text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-950">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your orders will appear here after you make a purchase.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && data && data.items.length > 0 && (
          <>
            <div className="mt-8 space-y-4">
              {data.items.map((order: Order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-semibold text-slate-950">
                          Order #{order.id}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-slate-950">
                        {formatCurrency(order.total_amount)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-xs text-slate-500">Payment</span>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {order.payment_status}
                      </p>
                    </div>

                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-600"
                    >
                      View Order
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-500">
                  Page {data.page} of {data.total_pages}
                </span>

                <button
                  type="button"
                  disabled={page >= data.total_pages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
