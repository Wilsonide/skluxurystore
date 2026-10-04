"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { ProductService } from "@/app/services/product.service";
import type { ProductListItem, ProductQueryParams } from "@/app/types/product";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [brandId, setBrandId] = useState<number | undefined>();

  const [sort, setSort] = useState<SortOption>("newest");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params: ProductQueryParams = {
          page,
          page_size: PAGE_SIZE,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (categoryId) {
          params.category_id = categoryId;
        }

        if (brandId) {
          params.brand_id = brandId;
        }

        if (sort) {
          params.sort = sort;
        }

        const response = await ProductService.getAll(params);

        if (cancelled) return;

        setProducts(response.items);
        setTotal(response.total);
        setTotalPages(response.total_pages);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load products:", err);

        setProducts([]);
        setError("Unable to load products. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [page, search, categoryId, brandId, sort]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategoryId(undefined);
    setBrandId(undefined);
    setSort("newest");
    setPage(1);
  };

  const hasFilters =
    Boolean(search) ||
    Boolean(categoryId) ||
    Boolean(brandId) ||
    sort !== "newest";

  const pages = useMemo(() => {
    const result: number[] = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let current = start; current <= end; current++) {
      result.push(current);
    }

    return result;
  }, [page, totalPages]);

  const formatPrice = (price: unknown) => {
    if (typeof price !== "string" && typeof price !== "number") {
      return "Price unavailable";
    }

    const numericPrice = typeof price === "string" ? Number(price) : price;

    if (Number.isNaN(numericPrice)) {
      return "Price unavailable";
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  return (
    <main className="min-h-screen bg-brand-ivory">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <section className="border-b border-brand-border bg-brand-warm-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-brand-champagne" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-champagne">
                Our collection
              </p>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-brand-obsidian sm:text-4xl">
              Shop all products
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-brand-muted sm:text-base">
              Discover thoughtfully selected jewelry, watches, and accessories
              designed to complement your style.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search + controls */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}

          <div className="flex w-full max-w-xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />

              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products..."
                className="h-11 rounded-r-none border-brand-border bg-brand-warm-white pl-10 text-brand-obsidian placeholder:text-brand-muted focus:border-brand-champagne focus:ring-brand-champagne/15"
              />
            </div>

            <Button
              type="button"
              onClick={handleSearch}
              className="h-11 rounded-l-none border border-brand-obsidian bg-brand-obsidian px-6 text-brand-warm-white hover:bg-brand-espresso hover:text-brand-gold-light"
            >
              Search
            </Button>
          </div>

          {/* Controls */}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFiltersOpen((value) => !value)}
              className="h-11 gap-2 border-brand-border bg-brand-warm-white text-brand-obsidian hover:bg-brand-cream hover:text-brand-obsidian"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortOption);
                setPage(1);
              }}
              className="h-11 rounded-md border border-brand-border bg-brand-warm-white px-3 text-sm text-brand-obsidian outline-none transition-colors focus:border-brand-champagne focus:ring-2 focus:ring-brand-champagne/15"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
            </select>
          </div>
        </div>

        {/* ======================================================
            FILTER PANEL
        ====================================================== */}

        {filtersOpen && (
          <div className="mb-8 rounded-2xl border border-brand-border bg-brand-warm-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-champagne">
                  Refine
                </p>

                <h2 className="mt-1 text-sm font-semibold text-brand-obsidian">
                  Filter collection
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-brand-muted transition-colors hover:bg-brand-cream hover:text-brand-obsidian"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-5 h-px bg-brand-border" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-medium text-brand-muted-dark">
                  Category
                </label>

                <select
                  value={categoryId ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;

                    setCategoryId(value ? Number(value) : undefined);

                    setPage(1);
                  }}
                  className="h-11 w-full rounded-lg border border-brand-border bg-brand-ivory px-3 text-sm text-brand-obsidian outline-none transition-all focus:border-brand-champagne focus:ring-2 focus:ring-brand-champagne/15"
                >
                  <option value="">All categories</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}

              <div>
                <label className="mb-2 block text-sm font-medium text-brand-muted-dark">
                  Brand
                </label>

                <select
                  value={brandId ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;

                    setBrandId(value ? Number(value) : undefined);

                    setPage(1);
                  }}
                  className="h-11 w-full rounded-lg border border-brand-border bg-brand-ivory px-3 text-sm text-brand-obsidian outline-none transition-all focus:border-brand-champagne focus:ring-2 focus:ring-brand-champagne/15"
                >
                  <option value="">All brands</option>

                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear */}

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="h-11 w-full gap-2 border-brand-border bg-brand-warm-white text-brand-muted-dark hover:bg-brand-cream hover:text-brand-obsidian"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            RESULT HEADER
        ====================================================== */}

        <div className="mb-5 flex items-center justify-between border-b border-brand-border pb-4">
          <p className="text-sm text-brand-muted">
            {loading
              ? "Loading products..."
              : `${total} ${total === 1 ? "product" : "products"}`}
          </p>

          {hasFilters && !loading && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted transition-colors hover:text-brand-obsidian"
            >
              Clear all
            </button>
          )}
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && !loading && (
          <div className="rounded-2xl border border-brand-border bg-brand-warm-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-px w-10 bg-brand-champagne" />

            <p className="text-sm font-medium text-brand-obsidian">{error}</p>

            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((current) => current)}
              className="mt-5 border-brand-border bg-brand-warm-white text-brand-obsidian hover:bg-brand-cream"
            >
              Try again
            </Button>
          </div>
        )}

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-brand-cream" />

                <div className="mt-4 h-4 w-3/4 rounded bg-brand-cream" />

                <div className="mt-2 h-4 w-1/2 rounded bg-brand-cream" />
              </div>
            ))}
          </div>
        )}

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-brand-border-dark bg-brand-warm-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 h-px w-10 bg-brand-champagne" />

            <h2 className="text-lg font-semibold text-brand-obsidian">
              No products found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">
              We couldn&apos;t find any products matching your search or
              filters.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="mt-5 border-brand-border bg-brand-warm-white text-brand-obsidian hover:bg-brand-cream"
            >
              View all products
            </Button>
          </div>
        )}

        {/* ======================================================
            PRODUCTS
        ====================================================== */}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-border bg-brand-cream transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand-border-dark group-hover:shadow-[0_14px_35px_rgba(23,18,15,0.10)]">
                  {product.cover_image ? (
                    <img
                      src={product.cover_image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-brand-muted">
                      No image
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-obsidian/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {product.is_featured && (
                    <span className="absolute left-3 top-3 rounded-full border border-brand-champagne/40 bg-brand-obsidian/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-light shadow-sm backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-brand-obsidian transition-colors duration-200 group-hover:text-brand-champagne sm:text-base">
                    {product.name}
                  </h2>

                  {"price" in product && product.price != null && (
                    <p className="mt-2 text-sm font-semibold text-brand-obsidian">
                      {formatPrice(product.price)}
                    </p>
                  )}

                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted transition-colors group-hover:text-brand-champagne">
                    View product
                    <span className="ml-1">→</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ======================================================
            PAGINATION
        ====================================================== */}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="border-brand-border bg-brand-warm-white text-brand-muted-dark hover:bg-brand-cream hover:text-brand-obsidian disabled:opacity-40"
            >
              Previous
            </Button>

            {pages.map((currentPage) => (
              <Button
                key={currentPage}
                type="button"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setPage(currentPage)}
                className={
                  currentPage === page
                    ? "h-10 w-10 border-brand-obsidian bg-brand-obsidian px-0 text-brand-warm-white hover:bg-brand-espresso hover:text-brand-gold-light"
                    : "h-10 w-10 border-brand-border bg-brand-warm-white px-0 text-brand-muted-dark hover:bg-brand-cream hover:text-brand-obsidian"
                }
              >
                {currentPage}
              </Button>
            ))}

            <Button
              type="button"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="border-brand-border bg-brand-warm-white text-brand-muted-dark hover:bg-brand-cream hover:text-brand-obsidian disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
