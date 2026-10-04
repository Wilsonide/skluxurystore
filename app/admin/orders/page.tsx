/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  RefreshCw,
} from "lucide-react";

import { OrderService } from "@/app/services/order.service";

import type {
  Order,
  OrderPaginationParams,
  PaginatedOrders,
} from "@/app/types/order";

export default function AdminOrdersPage() {
  const [data, setData] = useState<PaginatedOrders | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const pageSize = 20;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: OrderPaginationParams = {
        page,
        page_size: pageSize,
      };

      const result = await OrderService.getAll(params);

      setData(result);
    } catch (error: any) {
      setError(
        error?.response?.data?.detail ??
          error?.message ??
          "Failed to load orders.",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchOrders());
  }, [fetchOrders]);

  const orders: Order[] = data?.items ?? [];

  const formatCurrency = (value: string | number) => {
    return `₦${Number(value).toLocaleString()}`;
  };

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <main className="p-6 lg:p-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders and payments.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ORDERS */}

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />

            <p className="mt-3 text-sm text-slate-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 font-semibold text-slate-900">
              No orders found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Items
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-slate-50">
                      {/* ORDER */}

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          #{order.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(order.created_at)}
                        </p>
                      </td>

                      {/* CUSTOMER */}

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          User #{order.user_id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {order.phone_number}
                        </p>
                      </td>

                      {/* ITEMS */}

                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </span>
                      </td>

                      {/* AMOUNT */}

                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </td>

                      {/* PAYMENT */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            order.payment_status,
                          )}`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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

            {/* MOBILE */}

            <div className="divide-y divide-slate-100 md:hidden">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-5 transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Order #{order.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        User #{order.user_id}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(order.total_amount)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        order.payment_status,
                      )}`}
                    >
                      {order.payment_status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* PAGINATION */}

      {data && data.total_pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {data.page} of {data.total_pages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={data.page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              disabled={data.page >= data.total_pages || loading}
              onClick={() =>
                setPage((current) => Math.min(data.total_pages, current + 1))
              }
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
