"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";

import ProductGrid from "@/components/products/ProductGrid";
import { useProducts } from "@/app/hooks/use-products";

export default function CategoryProductsPage() {
  const params = useParams();
  const categoryId = Number(params.categoryId);

  const { products, pagination, loading, error } = useProducts({
    page: 1,
    page_size: 20,
    category_id: categoryId,
    available: true,
  });

  if (!categoryId || Number.isNaN(categoryId)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-ivory px-4">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-brand-champagne" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-champagne">
              Collection
            </span>
            <span className="h-px w-8 bg-brand-champagne" />
          </div>

          <h1 className="text-2xl font-semibold text-brand-obsidian">
            Invalid category
          </h1>

          <p className="mt-2 text-sm text-brand-muted">
            The category you are looking for could not be found.
          </p>

          <Link
            href="/categories"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-warm-white transition-all duration-200 hover:bg-brand-espresso hover:text-brand-gold-light"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/categories"
          className="group inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors duration-200 hover:text-brand-obsidian"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          All categories
        </Link>

        {/* Header */}
        <div className="mb-10 mt-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-brand-champagne" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-champagne">
              Collection
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-brand-obsidian sm:text-4xl">
            Category Products
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-brand-muted">
            Browse products in this category.
          </p>
        </div>

        {/* Products */}
        <section>
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between border-b border-brand-border pb-4">
                <div>
                  <p className="text-sm font-medium text-brand-obsidian">
                    {pagination?.total ?? 0}{" "}
                    {pagination?.total === 1 ? "product" : "products"}
                  </p>

                  <p className="mt-1 text-xs text-brand-muted">
                    Available pieces from this collection.
                  </p>
                </div>

                <Link
                  href="/shop"
                  className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted transition-colors hover:text-brand-obsidian sm:flex"
                >
                  Shop all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <ProductGrid products={products} isLoading={loading} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
