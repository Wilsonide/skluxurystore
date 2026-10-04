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
      return "bg-emerald-50 text-emerald-700";

    case "failed":
      return "bg-red-50 text-red-700";

    case "pending":
    case "processing":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-slate-100 text-slate-600";
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
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-8">
        <Link
          href="/account"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to account
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Payments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View your payment history and transaction details.
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border bg-white p-5"
            >
              <div className="h-5 w-40 rounded bg-slate-200" />

              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <div className="h-10 rounded bg-slate-200" />
                <div className="h-10 rounded bg-slate-200" />
                <div className="h-10 rounded bg-slate-200" />
                <div className="h-10 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Unable to load payments
          </h2>

          <p className="mt-1 text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => void fetchPayments()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && payments.length === 0 && (
        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-dashed bg-white">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <CreditCard className="h-6 w-6 text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-950">
              No payments yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your payment transactions will appear here after you place an
              order.
            </p>

            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}

      {/* PAYMENTS */}
      {!loading && !error && payments.length > 0 && (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* PAYMENT INFO */}
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-slate-950">
                      Payment #{payment.id}
                    </h2>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        payment.status,
                      )}`}
                    >
                      {getStatusIcon(payment.status)}

                      <span className="capitalize">{payment.status}</span>
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {formatDateTime(payment.created_at)}
                  </p>
                </div>

                {/* AMOUNT */}
                <div className="sm:text-right">
                  <p className="text-xl font-bold text-slate-950">
                    {formatCurrency(payment.amount)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Order #{payment.order_id}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">Reference</p>

                  <p className="mt-1 break-all text-sm font-medium text-slate-900">
                    {payment.reference}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Channel</p>

                  <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                    {payment.channel ?? "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Created</p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {formatDate(payment.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Paid at</p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {payment.paid_at
                      ? formatDateTime(payment.paid_at)
                      : "Not paid"}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/account/orders/${payment.order_id}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  View Order
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
