/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  XCircle,
} from "lucide-react";

import { PaymentService } from "@/app/services/payment.service";
import type { Payment } from "@/app/services/payment.service";

function formatCurrency(amount: string | number) {
  return `₦${Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "success":
    case "successful":
    case "paid":
      return <CheckCircle2 className="h-4 w-4" />;

    case "failed":
      return <XCircle className="h-4 w-4" />;

    case "pending":
    case "processing":
      return <Clock3 className="h-4 w-4" />;

    default:
      return <CreditCard className="h-4 w-4" />;
  }
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "success":
    case "successful":
    case "paid":
      return "border border-brand-gold-light bg-brand-gold-soft text-brand-espresso";

    case "failed":
      return "border border-red-200 bg-red-50 text-red-700";

    case "pending":
    case "processing":
      return "border border-brand-gold-light bg-brand-cream text-brand-espresso";

    default:
      return "border border-brand-border bg-brand-cream text-brand-muted-dark";
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await PaymentService.getMyPayments();

      setPayments(result);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: {
            detail?: string;
          };
        };
      };

      setError(
        axiosError.response?.data?.detail ??
          "Failed to load your payment history.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchPayments());
  }, [fetchPayments]);

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b border-brand-border pb-8">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-obsidian"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-champagne">
            Account
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-obsidian sm:text-4xl">
            Payments
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-brand-muted">
            View your payment history and transaction details.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-brand-border bg-brand-warm-white p-5 sm:p-6"
              >
                <div className="h-5 w-40 rounded bg-brand-cream" />

                <div className="mt-5 grid gap-4 sm:grid-cols-4">
                  <div className="h-10 rounded-lg bg-brand-cream" />
                  <div className="h-10 rounded-lg bg-brand-cream" />
                  <div className="h-10 rounded-lg bg-brand-cream" />
                  <div className="h-10 rounded-lg bg-brand-cream" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-900">
              Unable to load payments
            </h2>

            <p className="mt-1 text-sm leading-6 text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => void fetchPayments()}
              className="mt-4 rounded-xl bg-brand-obsidian px-4 py-2.5 text-sm font-semibold text-brand-warm-white transition-colors hover:bg-brand-espresso hover:text-brand-gold-light"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && payments.length === 0 && (
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-dashed border-brand-border-dark bg-brand-warm-white px-6">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-border bg-brand-cream">
                <CreditCard className="h-6 w-6 text-brand-champagne" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-brand-obsidian">
                No payments yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-brand-muted">
                Your payment transactions will appear here after you place an
                order.
              </p>

              <Link
                href="/shop"
                className="mt-5 inline-flex rounded-xl bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-warm-white transition-colors hover:bg-brand-espresso hover:text-brand-gold-light"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Payments */}
        {!loading && !error && payments.length > 0 && (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-2xl border border-brand-border bg-brand-warm-white p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(23,18,15,0.05)] sm:p-6"
              >
                {/* Payment header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  {/* Payment info */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-semibold text-brand-obsidian">
                        Payment #{payment.id}
                      </h2>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusClasses(
                          payment.status,
                        )}`}
                      >
                        {getStatusIcon(payment.status)}
                        <span>{payment.status}</span>
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-brand-muted">
                      {formatDateTime(payment.created_at)}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="sm:text-right">
                    <p className="text-xl font-semibold tracking-tight text-brand-obsidian">
                      {formatCurrency(payment.amount)}
                    </p>

                    <p className="mt-1 text-xs text-brand-muted">
                      Order #{payment.order_id}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 grid gap-5 border-t border-brand-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                      Reference
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-brand-espresso">
                      {payment.reference}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                      Channel
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-brand-espresso">
                      {payment.channel ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-medium text-brand-espresso">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                      Paid at
                    </p>

                    <p className="mt-1 text-sm font-medium text-brand-espresso">
                      {payment.paid_at
                        ? formatDateTime(payment.paid_at)
                        : "Not paid"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3 border-t border-brand-border pt-5">
                  <Link
                    href={`/account/orders/${payment.order_id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-warm-white px-4 py-2.5 text-sm font-medium text-brand-espresso transition-colors hover:border-brand-border-dark hover:bg-brand-cream hover:text-brand-obsidian"
                  >
                    View Order
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
