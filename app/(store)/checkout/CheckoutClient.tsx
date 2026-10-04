"use client";

import dynamic from "next/dynamic";

const CheckoutContent = dynamic(() => import("./CheckoutContent"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-brand-ivory px-4 py-16">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold-light bg-brand-gold-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-champagne border-t-transparent" />
        </div>

        <p className="mt-6 text-sm font-medium tracking-wide text-brand-champagne">
          Secure Checkout
        </p>

        <h1 className="mt-1 text-2xl font-bold text-brand-obsidian">
          Loading Checkout
        </h1>

        <p className="mt-3 text-sm text-brand-muted">
          Preparing your secure checkout...
        </p>
      </div>
    </main>
  ),
});

export default function CheckoutClient() {
  return <CheckoutContent />;
}
