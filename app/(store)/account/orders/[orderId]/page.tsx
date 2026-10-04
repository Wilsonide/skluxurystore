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
      <main className="min-h-screen bg-brand-ivory">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-brand-cream" />

          <div className="mt-8 h-10 w-64 animate-pulse rounded bg-brand-cream" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="h-96 animate-pulse rounded-2xl border border-brand-border bg-brand-warm-white" />

            <div className="h-64 animate-pulse rounded-2xl border border-brand-border bg-brand-warm-white" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-border bg-brand-warm-white">
            <Package className="h-7 w-7 text-brand-champagne" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-brand-obsidian">
            Order not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-brand-muted">
            {error ?? "We couldn't find the order you're looking for."}
          </p>

          <Link
            href="/account/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-warm-white transition-colors hover:bg-brand-espresso hover:text-brand-gold-light"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-obsidian"
        >
          <ArrowLeft className="h-4 w-4" />
          My Orders
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-5 border-b border-brand-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-champagne">
              Order #{order.id}
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-obsidian sm:text-4xl">
              Order Details
            </h1>

            <p className="mt-2 text-sm text-brand-muted">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div
            className={`w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${getStatusClass(
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
            <section className="overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white">
              <div className="border-b border-brand-border bg-brand-cream/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-obsidian">
                    <Package className="h-4 w-4 text-brand-gold-light" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-brand-obsidian">
                      Order Items
                    </h2>

                    <p className="mt-0.5 text-xs text-brand-muted">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "line item" : "line items"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-brand-border">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-6"
                  >
                    <div>
                      <p className="font-medium text-brand-obsidian">
                        Variant #{item.variant_id}
                      </p>

                      <p className="mt-1 text-sm text-brand-muted">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-brand-obsidian">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping */}
            <section className="rounded-2xl border border-brand-border bg-brand-warm-white p-6">
              <h2 className="font-semibold text-brand-obsidian">
                Shipping Information
              </h2>

              <div className="mt-5 space-y-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-cream">
                    <MapPin className="h-4 w-4 text-brand-champagne" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                      Shipping Address
                    </p>

                    <p className="mt-1 text-sm leading-6 text-brand-espresso">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-cream">
                    <Phone className="h-4 w-4 text-brand-champagne" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                      Phone Number
                    </p>

                    <p className="mt-1 text-sm text-brand-espresso">
                      {order.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Order status reassurance */}
            <div className="flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-cream p-5">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-champagne" />

              <div>
                <p className="text-sm font-semibold text-brand-obsidian">
                  Order information
                </p>

                <p className="mt-1 text-sm leading-6 text-brand-muted-dark">
                  Your order details and payment status are shown here for easy
                  reference.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside className="h-fit overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white">
            <div className="border-b border-brand-border bg-brand-cream/50 p-6">
              <h2 className="font-semibold text-brand-obsidian">
                Order Summary
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Items</span>

                  <span className="font-medium text-brand-espresso">
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Payment Status</span>

                  <span className="font-medium text-brand-espresso">
                    {order.payment_status}
                  </span>
                </div>

                <div className="border-t border-brand-border pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <span className="font-semibold text-brand-obsidian">
                      Total
                    </span>

                    <span className="text-xl font-semibold text-brand-obsidian">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-border bg-brand-cream p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-warm-white">
                  <CreditCard className="h-4 w-4 text-brand-champagne" />
                </div>

                <div>
                  <p className="text-xs text-brand-muted">Payment</p>

                  <p className="mt-0.5 text-sm font-medium text-brand-espresso">
                    {order.payment_status}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
