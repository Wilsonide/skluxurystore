import { Suspense } from "react";

import PaymentSuccessContent from "./payment-success-content";

function PaymentSuccessFallback() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-brand-ivory px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-warm-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold-light bg-brand-gold-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold-light border-t-brand-champagne" />
        </div>

        <p className="mt-6 text-sm font-medium tracking-wide text-brand-champagne">
          Secure Payment
        </p>

        <h1 className="mt-1 text-2xl font-bold text-brand-obsidian">
          Loading Payment
        </h1>

        <p className="mt-3 text-sm text-brand-muted">
          Preparing your payment verification...
        </p>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
