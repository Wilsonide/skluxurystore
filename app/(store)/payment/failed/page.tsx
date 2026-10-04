"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-16">
      <div className="mx-auto flex max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-9 w-9 text-red-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Payment Failed
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            We couldn&apos;t complete your payment. No worries — your cart is
            still available. You can try the payment again.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Link>

            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
