/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";

import { OrderService } from "@/app/services/order.service";

import type { Order } from "@/app/types/order";

function formatCurrency(value: string | number) {
  return `₦${Number(value).toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
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

export default function OrderDetailsPage() {
  const params = useParams();

  const orderId = Number(params.orderId);

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!orderId || Number.isNaN(orderId)) {
      setError("Invalid order.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await OrderService.getMyOrder(orderId);

      setOrder(result);
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to load this order.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void Promise.resolve().then(() => loadOrder());
  }, [loadOrder]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 h-10 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="h-96 animate-pulse rounded-2xl bg-white" />

            <div className="h-64 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Package className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Order not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error ?? "We couldn't find the order you're looking for."}
          </p>

          <Link
            href="/account/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          My Orders
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Order #{order.id}</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Order Details
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
              order.status,
            )}`}
          >
            {order.status}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Items */}
            <section className="rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 p-6">
                <h2 className="font-semibold text-slate-950">Order Items</h2>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-6"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        Variant #{item.variant_id}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-slate-950">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-950">
                Shipping Information
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-500">Shipping Address</p>

                    <p className="mt-1 text-sm text-slate-700">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-500">Phone Number</p>

                    <p className="mt-1 text-sm text-slate-700">
                      {order.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-950">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Items</span>

                <span className="font-medium text-slate-900">
                  {order.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Payment Status</span>

                <span className="font-medium text-slate-900">
                  {order.payment_status}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-950">Total</span>

                  <span className="text-xl font-bold text-slate-950">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-lg bg-slate-50 p-3">
              <CreditCard className="h-5 w-5 text-slate-500" />

              <div>
                <p className="text-xs text-slate-500">Payment</p>

                <p className="text-sm font-medium text-slate-800">
                  {order.payment_status}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
