"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductFilters, {
  type ProductFilterValues,
} from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import ProductSearch from "@/components/products/ProductSearch";

import { useProducts } from "@/app/hooks/use-products";
import { useCategories } from "@/app/hooks/use-categories";
import { useBrands } from "@/app/hooks/use-brands";

import type { ProductQueryParams } from "@/app/types/product";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ============================================================
     URL FILTER VALUES
  ============================================================ */

  const query = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category_id");
  const brandId = searchParams.get("brand_id");
  const featuredParam = searchParams.get("featured");
  const availableParam = searchParams.get("available");
  const minPriceParam = searchParams.get("min_price");
  const maxPriceParam = searchParams.get("max_price");

  const page = Number(searchParams.get("page") ?? 1);

  const sort = (searchParams.get("sort") ??
    "newest") as ProductQueryParams["sort"];

  /* ============================================================
     PARSED FILTER VALUES
  ============================================================ */

  const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  const featured = featuredParam === "true" ? true : undefined;

  // Products are available by default.
  const available = availableParam === "false" ? false : true;

  /* ============================================================
     SUPPORTING DATA
  ============================================================ */

  const { categories } = useCategories();
  const { brands } = useBrands();

  /* ============================================================
     PRODUCTS
  ============================================================ */

  const { products, pagination, loading, error } = useProducts({
    page,
    page_size: 20,
    search: query || undefined,
    category_id: categoryId ? Number(categoryId) : undefined,
    brand_id: brandId ? Number(brandId) : undefined,
    min_price: minPrice,
    max_price: maxPrice,
    featured,
    available,
    sort,
  });

  /* ============================================================
     URL UPDATE
  ============================================================ */

  const updateUrl = useCallback(
    (values: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());

      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });

      router.push(`/shop?${next.toString()}`);
    },
    [router, searchParams],
  );

  /* ============================================================
     FILTER STATE
  ============================================================ */

  const filters = useMemo<ProductFilterValues>(
    () => ({
      category_id: categoryId ? Number(categoryId) : undefined,
      brand_id: brandId ? Number(brandId) : undefined,
      min_price: minPrice,
      max_price: maxPrice,
      featured,
      available,
      sort,
    }),
    [categoryId, brandId, minPrice, maxPrice, featured, available, sort],
  );

  /* ============================================================
     SEARCH
  ============================================================ */

  const handleSearch = useCallback(
    (value: string) => {
      updateUrl({
        search: value || undefined,
        page: "1",
      });
    },
    [updateUrl],
  );

  /* ============================================================
     FILTERS
  ============================================================ */

  const handleFilters = useCallback(
    (values: ProductFilterValues) => {
      updateUrl({
        category_id: values.category_id?.toString(),

        brand_id: values.brand_id?.toString(),

        min_price:
          values.min_price !== undefined
            ? values.min_price.toString()
            : undefined,

        max_price:
          values.max_price !== undefined
            ? values.max_price.toString()
            : undefined,

        featured: values.featured ? "true" : undefined,

        available:
          values.available !== undefined
            ? values.available.toString()
            : undefined,

        sort: values.sort || "newest",

        page: "1",
      });
    },
    [updateUrl],
  );

  /* ============================================================
     TITLE
  ============================================================ */

  const title = query ? `Search results for "${query}"` : "Shop all products";

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="min-h-screen bg-brand-ivory">
      {/* ========================================================
          PAGE INTRO
      ======================================================== */}

      <section className="relative overflow-hidden border-b border-brand-border bg-brand-cream">
        {/* Subtle champagne accent */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-champagne/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-brand-champagne" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-champagne">
                Collection
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-brand-obsidian sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-muted-dark sm:text-base">
              Browse our collection and find something you love.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SHOP CONTENT
      ======================================================== */}

      <section className="bg-brand-ivory">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          {/* ====================================================
              SEARCH
          ==================================================== */}

          <div className="mb-8">
            <ProductSearch value={query} onChange={handleSearch} />
          </div>

          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            {/* ==================================================
                FILTERS
            ================================================== */}

            <aside>
              <ProductFilters
                categories={categories}
                brands={brands}
                values={filters}
                onChange={handleFilters}
              />
            </aside>

            {/* ==================================================
                PRODUCTS
            ================================================== */}

            <section>
              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                  {error}
                </div>
              ) : (
                <>
                  {/* ============================================
                      RESULTS META
                  ============================================ */}

                  <div className="mb-5 flex items-center justify-between border-b border-brand-border pb-4">
                    <div>
                      <p className="text-sm font-medium text-brand-obsidian">
                        {pagination?.total ?? 0}{" "}
                        {pagination?.total === 1 ? "product" : "products"}
                      </p>

                      {query && (
                        <p className="mt-1 text-xs text-brand-muted">
                          Showing results matching your search.
                        </p>
                      )}
                    </div>

                    <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted sm:block">
                      Refined selection
                    </span>
                  </div>

                  <ProductGrid products={products} isLoading={loading} />
                </>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
