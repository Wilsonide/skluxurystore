/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Package,
  Phone,
  RefreshCw,
} from "lucide-react";

import { OrderService } from "@/app/services/order.service";

import type { Order } from "@/app/types/order";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = Number(params.orderId);

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId || Number.isNaN(orderId)) {
      setError("Invalid order ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await OrderService.getById(orderId);

      setOrder(result);
    } catch (error: any) {
      setError(
        error?.response?.data?.detail ??
          error?.message ??
          "Failed to load order.",
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchOrder());
  }, [fetchOrder]);

  const formatCurrency = (value: string | number) => {
    return `₦${Number(value).toLocaleString()}`;
  };

  const formatDate = (value: string) => {
    return new Date(value).toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  if (loading) {
    return (
      <main className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 rounded bg-slate-200" />

          <div className="h-32 rounded-xl bg-slate-200" />

          <div className="h-64 rounded-xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="p-6 lg:p-8">
        <button
          type="button"
          onClick={() => router.push("/admin/orders")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </button>

        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <Package className="mx-auto h-10 w-10 text-red-400" />

          <h1 className="mt-4 text-xl font-bold text-red-900">
            Unable to load order
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {error ?? "Order not found."}
          </p>

          <button
            type="button"
            onClick={fetchOrder}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 lg:p-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Order #{order.id}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                order.status,
              )}`}
            >
              {order.status}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Placed {formatDate(order.created_at)}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrder}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* MAIN */}

        <div className="space-y-8">
          {/* ORDER ITEMS */}

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-950">Order Items</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => {
                const variant = item.variant;

                const product = variant?.product;

                return (
                  <div key={item.id} className="flex gap-4 p-5">
                    {/* IMAGE */}

                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {product?.cover_image ? (
                        <Image
                          src={product.cover_image}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-900">
                        {product?.name ?? "Product"}
                      </h3>

                      {variant?.sku && (
                        <p className="mt-1 text-xs text-slate-500">
                          SKU: {variant.sku}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                        {variant?.color && <span>Color: {variant.color}</span>}

                        {variant?.size && <span>Size: {variant.size}</span>}
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    {/* PRICE */}

                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SHIPPING */}

          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-950">
                Shipping Information
              </h2>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-900">
                    {order.shipping_address}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone Number
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {order.phone_number}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}

        <aside className="space-y-6">
          {/* SUMMARY */}

          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-950">Order Summary</h2>
            </div>

            <div className="p-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Items</span>

                <span className="font-medium text-slate-900">
                  {order.items.length}
                </span>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Total</span>

                  <span className="text-xl font-bold text-slate-950">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* PAYMENT */}

          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-950">Payment</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Payment Status
                  </p>

                  <p
                    className={`mt-1 text-xs font-medium ${
                      order.payment_status.toLowerCase() === "paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.payment_status}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CUSTOMER */}

          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-950">Customer</h2>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  User ID
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {order.user_id}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-sm text-slate-900">
                  {order.phone_number}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
