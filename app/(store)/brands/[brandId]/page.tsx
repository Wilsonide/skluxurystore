"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { useParams } from "next/navigation";

import ProductGrid from "@/components/products/ProductGrid";
import { useBrands } from "@/app/hooks/use-brands";
import { useProducts } from "@/app/hooks/use-products";

export default function BrandDetailsPage() {
  const params = useParams();
  const brandId = Number(params.brandId);

  const { brands, loading: brandsLoading } = useBrands();

  const {
    products,
    pagination,
    loading: productsLoading,
    error,
  } = useProducts({
    page: 1,
    page_size: 20,
    brand_id: brandId,
    available: true,
  });

  const brand = brands.find((item) => item.id === brandId);
  const loading = brandsLoading || productsLoading;

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="h-3 w-28 animate-pulse rounded bg-brand-gold-soft" />

            <div className="mt-4 h-9 w-48 animate-pulse rounded-lg bg-brand-cream" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-brand-cream" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-2xl border border-brand-border bg-brand-cream"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-ivory px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cream ring-1 ring-brand-border">
            <Tag className="h-7 w-7 text-brand-champagne" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-brand-obsidian">
            Brand not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-brand-muted">
            The brand you are looking for does not exist.
          </p>

          <Link
            href="/brands"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-warm-white transition-all duration-200 hover:bg-brand-espresso hover:text-brand-gold-light"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Brands
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
          href="/brands"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors duration-200 hover:text-brand-obsidian"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to brands
        </Link>

        {/* Brand Header */}
        <section className="relative mb-10 overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white p-6 shadow-sm sm:p-8">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-cream" />

          <div className="relative flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-obsidian text-xl font-semibold text-brand-champagne shadow-sm">
              {brand.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-champagne">
                Collection
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-brand-obsidian">
                {brand.name}
              </h1>

              <p className="mt-1 text-sm text-brand-muted">
                Explore products from {brand.name}.
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section>
          <div className="mb-5 flex items-end justify-between border-b border-brand-border pb-4">
            <div>
              <h2 className="text-xl font-semibold text-brand-obsidian">
                {brand.name} Products
              </h2>

              <p className="mt-1 text-sm text-brand-muted">
                {pagination?.total ?? 0}{" "}
                {pagination?.total === 1 ? "product" : "products"}
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

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <ProductGrid products={products} isLoading={productsLoading} />
          )}
        </section>
      </div>
    </main>
  );
}
