"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FolderOpen, Sparkles } from "lucide-react";

import { useCategories } from "@/app/hooks/use-categories";
import { useProducts } from "@/app/hooks/use-products";

const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85";

export default function CategoriesPage() {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return <CategoriesSkeleton />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <section className="border-b border-brand-border bg-brand-cream">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-xl rounded-2xl border border-red-200 bg-brand-warm-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                <FolderOpen className="h-5 w-5 text-red-600" />
              </div>

              <h2 className="mt-4 font-semibold text-brand-obsidian">
                Unable to load categories
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-600">{error}</p>
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
      <section className="relative overflow-hidden border-b border-brand-border bg-brand-cream">
        {/* Subtle champagne accent */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-champagne/[0.08] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-brand-champagne" />

              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-champagne">
                <Sparkles className="h-3.5 w-3.5" />
                Explore the collection
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-brand-obsidian sm:text-5xl">
              Shop by Category
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-brand-muted-dark">
              Browse our collection by category and discover pieces selected to
              complement your style.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          CATEGORIES
      ============================================================ */}
      <section className="bg-brand-ivory">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {categories.length === 0 ? (
            <EmptyCategories />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ================================================================
   CATEGORY CARD
================================================================ */

function CategoryCard({
  category,
}: {
  category: {
    id: number;
    name: string;
    description?: string | null;
  };
}) {
  const { products, loading } = useProducts({
    category_id: category.id,
    page: 1,
    page_size: 1,
  });

  const productImage = products?.[0]?.cover_image || DEFAULT_CATEGORY_IMAGE;

  if (loading) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-brand-border bg-brand-cream">
        <div className="absolute inset-0 animate-pulse bg-brand-cream" />

        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="h-3 w-20 animate-pulse rounded bg-brand-border" />

          <div className="mt-3 h-6 w-32 animate-pulse rounded bg-brand-border" />

          <div className="mt-3 h-3 w-44 animate-pulse rounded bg-brand-border" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/categories/${category.id}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-brand-cream shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(23,18,15,0.16)]"
    >
      {/* Image */}
      <Image
        src={productImage}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Image treatment */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/35 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

      {/* Champagne glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-champagne/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Top icon */}
      <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold-light/25 bg-brand-obsidian/25 text-brand-gold-light backdrop-blur-md transition-all duration-300 group-hover:border-brand-gold-light/60 group-hover:bg-brand-obsidian/70">
        <FolderOpen className="h-4 w-4" />
      </div>

      {/* Arrow */}
      <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold-light/25 bg-brand-obsidian/25 text-brand-gold-light backdrop-blur-md transition-all duration-300 group-hover:border-brand-gold-light group-hover:bg-brand-gold-light group-hover:text-brand-obsidian">
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold-light/75">
          Category
        </p>

        <h2 className="text-xl font-semibold tracking-tight text-brand-warm-white sm:text-2xl">
          {category.name}
        </h2>

        {category.description ? (
          <p className="mt-2 line-clamp-2 max-w-[90%] text-sm leading-5 text-brand-warm-white/70">
            {category.description}
          </p>
        ) : (
          <p className="mt-2 text-sm text-brand-warm-white/65">
            Explore the collection
          </p>
        )}

        {/* Hover action */}
        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-brand-warm-white">
          <span>Shop category</span>

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-warm-white/10 transition-all duration-300 group-hover:bg-brand-gold-light group-hover:text-brand-obsidian">
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ================================================================
   LOADING SKELETON
================================================================ */

function CategoriesSkeleton() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      {/* Light header skeleton */}
      <section className="border-b border-brand-border bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="h-3 w-36 animate-pulse rounded bg-brand-gold-soft" />

            <div className="mt-5 h-12 w-72 animate-pulse rounded-lg bg-brand-border-dark/50 sm:w-96" />

            <div className="mt-5 h-4 w-full max-w-xl animate-pulse rounded bg-brand-border" />

            <div className="mt-2 h-4 w-4/5 max-w-lg animate-pulse rounded bg-brand-border" />
          </div>
        </div>
      </section>

      {/* Light cards area */}
      <section className="bg-brand-ivory">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="relative aspect-[4/5] animate-pulse overflow-hidden rounded-3xl border border-brand-border bg-brand-cream"
              >
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="h-3 w-20 rounded bg-brand-border" />

                  <div className="mt-3 h-6 w-32 rounded bg-brand-border" />

                  <div className="mt-3 h-3 w-44 rounded bg-brand-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyCategories() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-brand-border-dark bg-brand-warm-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cream ring-1 ring-brand-border">
        <FolderOpen className="h-7 w-7 text-brand-champagne" />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-brand-obsidian">
        No categories available
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-brand-muted">
        Categories will appear here once they have been added to the store.
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
