"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <main className="min-h-[70vh] bg-brand-ivory px-4 py-16">
      <div className="mx-auto flex max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-brand-border bg-brand-warm-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-50">
            <AlertCircle className="h-9 w-9 text-red-600" />
          </div>

          <p className="mt-6 text-sm font-medium tracking-wide text-brand-champagne">
            Payment Issue
          </p>

          <h1 className="mt-1 text-2xl font-bold text-brand-obsidian">
            Payment Failed
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-brand-muted">
            We couldn&apos;t complete your payment. No worries — your cart is
            still available. You can try the payment again.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Link>

            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-border bg-brand-warm-white px-5 py-3 text-sm font-semibold text-brand-espresso transition hover:bg-brand-cream"
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
