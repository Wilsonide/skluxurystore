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
      <main className="min-h-screen bg-white">
        <section className="border-b border-slate-100 bg-slate-50/60">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700">
                <Tag className="h-3.5 w-3.5" />
                Brands
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
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
    <main className="min-h-screen bg-white">
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <section className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />
              Explore our brands
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Shop by Brand
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
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
      className="group relative flex min-h-[190px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >
      {/* Subtle decorative element */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-125" />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition-colors duration-300 group-hover:bg-slate-800">
          <Tag className="h-5 w-5" />
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all duration-300 group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white">
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Brand information */}
      <div className="relative mt-auto pt-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Brand
        </p>

        <h2 className="mt-2 line-clamp-1 text-xl font-bold tracking-tight text-slate-950">
          {brand.name}
        </h2>

        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors duration-300 group-hover:text-slate-950">
          <span>View collection</span>

          <span className="h-px w-6 bg-slate-300 transition-all duration-300 group-hover:w-9 group-hover:bg-slate-950" />
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
    <main className="min-h-screen bg-white">
      {/* Header skeleton */}
      <section className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-2xl">
            <div className="h-7 w-44 animate-pulse rounded-full bg-slate-200" />

            <div className="mt-5 h-12 w-72 animate-pulse rounded-lg bg-slate-200 sm:w-96" />

            <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-slate-200" />

            <div className="mt-2 h-4 w-4/5 max-w-lg animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="relative min-h-[220px] animate-pulse overflow-hidden rounded-3xl bg-slate-200"
            >
              <div className="absolute left-5 top-5 h-10 w-10 rounded-full bg-slate-300" />

              <div className="absolute right-5 top-5 h-10 w-10 rounded-full bg-slate-300" />

              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-300" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="h-3 w-16 rounded bg-slate-300" />

                <div className="mt-3 h-6 w-32 rounded bg-slate-300" />

                <div className="mt-2 h-3 w-48 rounded bg-slate-300" />
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
    <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <Tag className="h-7 w-7 text-slate-400" />
      </div>

      <h2 className="mt-6 text-xl font-bold text-slate-950">
        No brands available
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Brands will appear here once they have been added to the store.
      </p>

      <Link
        href="/shop"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Browse Shop
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
