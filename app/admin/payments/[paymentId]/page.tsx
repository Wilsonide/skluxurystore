/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Loader2,
  XCircle,
  Clock3,
} from "lucide-react";

import { PaymentService, type Payment } from "@/app/services/payment.service";

export default function AdminPaymentDetailsPage() {
  const params = useParams();

  const paymentId = Number(params.paymentId);
  const hasValidPaymentId = Number.isFinite(paymentId) && paymentId > 0;

  const [payment, setPayment] = useState<Payment | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasValidPaymentId) {
      return;
    }

    const fetchPayment = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await PaymentService.getAdminById(paymentId);

        setPayment(result);
      } catch (error: any) {
        setError(error?.response?.data?.detail ?? "Failed to load payment.");
      } finally {
        setLoading(false);
      }
    };

    void fetchPayment();
  }, [hasValidPaymentId, paymentId]);

  if (!hasValidPaymentId) {
    return (
      <main className="px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-7 w-7 text-red-500" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-950">
          Payment not found
        </h1>

        <p className="mt-2 text-sm text-slate-500">Invalid payment ID.</p>

        <Link
          href="/admin/payments"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>
      </main>
    );
  }

  const formatAmount = (amount: string | number) => {
    return `₦${Number(amount).toLocaleString()}`;
  };

  const formatDate = (date?: string | null) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
      case "successful":
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;

      case "failed":
      case "cancelled":
      case "canceled":
        return <XCircle className="h-6 w-6 text-red-600" />;

      default:
        return <Clock3 className="h-6 w-6 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading payment...
        </div>
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-7 w-7 text-red-500" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-950">
          Payment not found
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {error ?? "The requested payment could not be found."}
        </p>

        <Link
          href="/admin/payments"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/payments"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-slate-700" />

              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Payment #{payment.id}
              </h1>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Transaction details and payment information.
            </p>
          </div>

          <Link
            href={`/admin/orders/${payment.order_id}`}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View order
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Status + Amount */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Payment status</p>

          <div className="mt-4 flex items-center gap-3">
            {getStatusIcon(payment.status)}

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusClasses(
                payment.status,
              )}`}
            >
              {payment.status}
            </span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Payment amount</p>

          <p className="mt-3 text-3xl font-bold text-slate-950">
            {formatAmount(payment.amount)}
          </p>
        </div>
      </div>

      {/* Transaction information */}
      <div className="rounded-xl border bg-white">
        <div className="border-b px-6 py-5">
          <h2 className="font-semibold text-slate-950">
            Transaction information
          </h2>
        </div>

        <div className="divide-y">
          <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Payment ID</span>

            <span className="text-sm font-semibold text-slate-900">
              #{payment.id}
            </span>
          </div>

          <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Reference</span>

            <span className="break-all text-sm font-semibold text-slate-900 sm:text-right">
              {payment.reference}
            </span>
          </div>

          <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Order</span>

            <Link
              href={`/admin/orders/${payment.order_id}`}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Order #{payment.order_id}
            </Link>
          </div>

          <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Payment channel</span>

            <span className="text-sm font-medium capitalize text-slate-900">
              {payment.channel ?? "—"}
            </span>
          </div>

          <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Created</span>

            <span className="text-sm font-medium text-slate-900">
              {formatDate(payment.created_at)}
            </span>
          </div>

          <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Paid at</span>

            <span className="text-sm font-medium text-slate-900">
              {formatDate(payment.paid_at)}
            </span>
          </div>

          <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Last updated</span>

            <span className="text-sm font-medium text-slate-900">
              {formatDate(payment.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
