"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-950">Invalid category</h1>

        <Link
          href="/categories"
          className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to categories
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All categories
      </Link>

      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Category Products
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Browse products in this category.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-5">
            <p className="text-sm text-slate-500">
              {pagination?.total ?? 0} products
            </p>
          </div>

          <ProductGrid products={products} isLoading={loading} />
        </>
      )}
    </main>
  );
}
