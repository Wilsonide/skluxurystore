"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-950">Brand not found</h1>

        <p className="mt-2 text-sm text-slate-500">
          The brand you are looking for does not exist.
        </p>

        <Link
          href="/brands"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* BACK */}
      <Link
        href="/brands"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to brands
      </Link>

      {/* BRAND HEADER */}
      <section className="mb-10 rounded-2xl border bg-white p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl font-bold text-slate-700">
            {brand.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {brand.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Explore products from {brand.name}.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              {brand.name} Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {pagination?.total ?? 0} products
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <ProductGrid products={products} isLoading={productsLoading} />
        )}
      </section>
    </main>
  );
}
