"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Tag } from "lucide-react";

import { useBrands } from "@/app/hooks/use-brands";

export default function BrandsPage() {
  const { brands, loading, error } = useBrands();

  if (loading) {
    return <BrandsSkeleton />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <section className="border-b border-brand-border bg-brand-cream/60">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-warm-white px-3.5 py-1.5 text-xs font-semibold text-brand-obsidian">
                <Tag className="h-3.5 w-3.5 text-brand-champagne" />
                Brands
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-brand-obsidian sm:text-5xl">
                Something went wrong
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-red-700">
                {error}
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-ivory">
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <section className="border-b border-brand-border bg-brand-cream/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-brand-champagne" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-champagne">
                Explore our brands
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-brand-obsidian sm:text-5xl">
              Shop by Brand
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-brand-muted">
              Discover products from brands we trust and collections curated to
              bring quality and style together.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          BRANDS
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {brands.length === 0 ? (
          <EmptyBrands />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ================================================================
   BRAND CARD
================================================================ */

function BrandCard({
  brand,
}: {
  brand: {
    id: number;
    name: string;
  };
}) {
  return (
    <Link
      href={`/brands/${brand.id}`}
      className="group relative flex min-h-[210px] flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-border-dark hover:shadow-[0_16px_35px_rgba(23,18,15,0.09)]"
    >
      {/* Decorative circle */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-cream transition-transform duration-500 group-hover:scale-125" />

      {/* Subtle gold accent */}
      <div className="pointer-events-none absolute right-0 top-0 h-20 w-px bg-brand-champagne/0 transition-colors duration-300 group-hover:bg-brand-champagne/60" />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-obsidian text-brand-champagne transition-all duration-300 group-hover:bg-brand-espresso">
          <Tag className="h-5 w-5" />
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-warm-white text-brand-muted transition-all duration-300 group-hover:border-brand-obsidian group-hover:bg-brand-obsidian group-hover:text-brand-gold-light">
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Brand information */}
      <div className="relative mt-auto pt-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-champagne">
          Brand
        </p>

        <h2 className="mt-2 line-clamp-1 text-xl font-semibold tracking-tight text-brand-obsidian">
          {brand.name}
        </h2>

        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors duration-300 group-hover:text-brand-obsidian">
          <span>View collection</span>

          <span className="h-px w-6 bg-brand-border-dark transition-all duration-300 group-hover:w-9 group-hover:bg-brand-champagne" />
        </div>
      </div>
    </Link>
  );
}

/* ================================================================
   LOADING SKELETON
================================================================ */

function BrandsSkeleton() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      {/* Header skeleton */}
      <section className="border-b border-brand-border bg-brand-cream/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-2xl">
            <div className="h-3 w-36 animate-pulse rounded bg-brand-gold-soft" />

            <div className="mt-5 h-12 w-72 animate-pulse rounded-lg bg-brand-cream sm:w-96" />

            <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-brand-cream" />

            <div className="mt-2 h-4 w-4/5 max-w-lg animate-pulse rounded bg-brand-cream" />
          </div>
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="relative min-h-[210px] animate-pulse overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white p-6"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-cream" />

              <div className="h-11 w-11 rounded-xl bg-brand-cream" />

              <div className="absolute right-6 top-6 h-9 w-9 rounded-full bg-brand-cream" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="h-3 w-16 rounded bg-brand-cream" />

                <div className="mt-3 h-6 w-32 rounded bg-brand-cream" />

                <div className="mt-3 h-3 w-28 rounded bg-brand-cream" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyBrands() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-brand-border-dark bg-brand-warm-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cream ring-1 ring-brand-border">
        <Tag className="h-7 w-7 text-brand-champagne" />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-brand-obsidian">
        No brands available
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-brand-muted">
        Brands will appear here once they have been added to the store.
      </p>

      <Link
        href="/shop"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-warm-white transition-all duration-200 hover:bg-brand-espresso hover:text-brand-gold-light"
      >
        Browse Shop
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
