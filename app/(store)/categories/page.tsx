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
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
            <FolderOpen className="h-5 w-5 text-red-600" />
          </div>

          <h2 className="mt-4 font-semibold text-red-900">
            Unable to load categories
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
        </div>
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
              Explore the collection
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Shop by Category
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Browse our collection by category and discover pieces selected to
              complement your style.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          CATEGORIES
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {categories.length === 0 ? (
          <EmptyCategories />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
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
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">
        <div className="absolute inset-0 animate-pulse bg-slate-200" />

        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-white/70" />
          <div className="mt-3 h-3 w-44 animate-pulse rounded bg-white/50" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/categories/${category.id}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-slate-200 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
    >
      {/* Image */}
      <Image
        src={productImage}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        className="object-cover transition duration-700 ease-out group-hover:scale-105"
      />

      {/* Image treatment */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent opacity-90 transition duration-500 group-hover:opacity-95" />

      {/* Top accent */}
      <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-slate-950">
        <FolderOpen className="h-4 w-4" />
      </div>

      {/* Arrow */}
      <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-slate-950">
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
          Category
        </p>

        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {category.name}
        </h2>

        {category.description ? (
          <p className="mt-2 line-clamp-2 max-w-[90%] text-sm leading-5 text-white/70">
            {category.description}
          </p>
        ) : (
          <p className="mt-2 text-sm text-white/65">Explore the collection</p>
        )}

        {/* Hover action */}
        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white">
          <span>Shop category</span>

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition duration-300 group-hover:bg-white group-hover:text-slate-950">
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
    <main className="min-h-screen bg-white">
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

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-[4/5] animate-pulse overflow-hidden rounded-3xl bg-slate-200"
            >
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="h-3 w-20 rounded bg-slate-300" />
                <div className="mt-3 h-6 w-32 rounded bg-slate-300" />
                <div className="mt-3 h-3 w-44 rounded bg-slate-300" />
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

function EmptyCategories() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <FolderOpen className="h-7 w-7 text-slate-400" />
      </div>

      <h2 className="mt-6 text-xl font-bold text-slate-950">
        No categories available
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Categories will appear here once they have been added to the store.
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
