"use client";

import type { ProductListItem } from "@/app/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: ProductListItem[];
  isLoading?: boolean;
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white">
      <div className="aspect-square animate-pulse bg-brand-cream" />

      <div className="space-y-3 p-4">
        <div className="h-5 animate-pulse rounded bg-brand-cream" />

        <div className="h-4 w-1/3 animate-pulse rounded bg-brand-cream" />

        <div className="h-8 w-1/2 animate-pulse rounded bg-brand-cream" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  products,
  isLoading = false,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-brand-border-dark bg-brand-warm-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-px w-10 bg-brand-champagne" />

          <h3 className="font-semibold text-brand-obsidian">
            No products found
          </h3>

          <p className="mt-1 text-sm text-brand-muted">
            Try adjusting your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
