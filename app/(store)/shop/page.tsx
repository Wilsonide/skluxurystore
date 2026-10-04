import { Suspense } from "react";

import ShopContent from "./shop-content";

function ShopFallback() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden border-b border-brand-border bg-brand-cream">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-champagne/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-brand-champagne" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-champagne">
                Collection
              </span>
            </div>

            <div className="h-10 w-72 animate-pulse rounded-lg bg-brand-cream sm:h-12 sm:w-96" />

            <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-brand-ivory" />
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-8 h-11 w-full animate-pulse rounded-xl bg-brand-cream" />

          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <div className="h-80 animate-pulse rounded-2xl border border-brand-border bg-brand-warm-white" />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/5] animate-pulse rounded-2xl bg-brand-cream"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopContent />
    </Suspense>
  );
}
