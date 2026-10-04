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
      return "border border-brand-gold-light bg-brand-gold-soft text-brand-espresso";

    case "PENDING":
      return "border border-brand-gold-light bg-brand-cream text-brand-espresso";

    case "PROCESSING":
      return "border border-brand-border bg-brand-cream text-brand-espresso";

    case "SHIPPED":
      return "border border-brand-gold-light bg-brand-gold-soft text-brand-espresso";

    case "CANCELLED":
    case "CANCELED":
      return "border border-red-200 bg-red-50 text-red-700";

    default:
      return "border border-brand-border bg-brand-cream text-brand-muted-dark";
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
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-obsidian"
        >
          <ArrowLeft className="h-4 w-4" />
          My Account
        </Link>

        {/* Header */}
        <div className="mt-8 border-b border-brand-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-champagne">
            Account
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-obsidian sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-brand-muted">
            View your order history and keep track of your purchases.
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
                className="h-32 animate-pulse rounded-2xl border border-brand-border bg-brand-warm-white"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && data?.items.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-brand-border-dark bg-brand-warm-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-border bg-brand-cream">
              <Package className="h-7 w-7 text-brand-champagne" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-brand-obsidian">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-brand-muted">
              Your orders will appear here after you make a purchase.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-xl bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-warm-white transition-colors hover:bg-brand-espresso hover:text-brand-gold-light"
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
                  className="rounded-2xl border border-brand-border bg-brand-warm-white p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(23,18,15,0.05)] sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Order identity */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-semibold text-brand-obsidian">
                          Order #{order.id}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusClass(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-brand-muted">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    {/* Order total */}
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-semibold text-brand-obsidian">
                        {formatCurrency(order.total_amount)}
                      </p>

                      <p className="mt-1 text-xs text-brand-muted">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Order footer */}
                  <div className="mt-5 flex flex-col gap-4 border-t border-brand-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-xs text-brand-muted">Payment</span>

                      <p className="mt-1 text-sm font-medium text-brand-espresso">
                        {order.payment_status}
                      </p>
                    </div>

                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-obsidian transition-colors hover:text-brand-champagne"
                    >
                      View Order
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-brand-border pt-6">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-xl border border-brand-border bg-brand-warm-white px-4 py-2.5 text-sm font-medium text-brand-espresso transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-brand-muted">
                  Page{" "}
                  <span className="font-semibold text-brand-obsidian">
                    {data.page}
                  </span>{" "}
                  of {data.total_pages}
                </span>

                <button
                  type="button"
                  disabled={page >= data.total_pages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-xl border border-brand-border bg-brand-warm-white px-4 py-2.5 text-sm font-medium text-brand-espresso transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
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
