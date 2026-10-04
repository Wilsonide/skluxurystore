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

  /*
   * ============================================================
   * LOAD PRODUCTS
   * ============================================================
   */

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

        /*
         * Only send optional filters when selected.
         */
        if (search.trim()) {
          params.search = search.trim();
        }

        if (categoryId) {
          params.category_id = categoryId;
        }

        if (brandId) {
          params.brand_id = brandId;
        }

        /*
         * Only include sort if your backend supports it.
         */
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

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */

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

  /*
   * ============================================================
   * FILTERS
   * ============================================================
   */

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

  /*
   * ============================================================
   * PAGINATION
   * ============================================================
   */

  const pages = useMemo(() => {
    const result: number[] = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let current = start; current <= end; current++) {
      result.push(current);
    }

    return result;
  }, [page, totalPages]);

  /*
   * ============================================================
   * FORMAT PRICE
   * ============================================================
   */

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

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-medium text-slate-500">
              Our collection
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Shop all products
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Discover quality products selected for you.
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
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products..."
                className="h-11 rounded-r-none border-slate-200 bg-white pl-10"
              />
            </div>

            <Button
              type="button"
              onClick={handleSearch}
              className="h-11 rounded-l-none px-6"
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
              className="h-11 gap-2 bg-white"
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
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
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
          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={categoryId ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;

                    setCategoryId(value ? Number(value) : undefined);

                    setPage(1);
                  }}
                  className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
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
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Brand
                </label>

                <select
                  value={brandId ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;

                    setBrandId(value ? Number(value) : undefined);

                    setPage(1);
                  }}
                  className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
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
                  className="h-11 w-full gap-2"
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

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {loading
              ? "Loading products..."
              : `${total} ${total === 1 ? "product" : "products"}`}
          </p>

          {hasFilters && !loading && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>

            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((current) => current)}
              className="mt-4 bg-white"
            >
              Try again
            </Button>
          </div>
        )}

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-slate-200" />

                <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />

                <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No products found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              We couldn&apos;t find any products matching your search or
              filters.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="mt-5"
            >
              View all products
            </Button>
          </div>
        )}

        {/* ======================================================
            PRODUCTS
        ====================================================== */}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                  {product.cover_image ? (
                    <img
                      src={product.cover_image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                      No image
                    </div>
                  )}

                  {product.is_featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                      Featured
                    </span>
                  )}
                </div>

                {/* Product info */}
                <div className="mt-4">
                  <h2 className="line-clamp-2 text-sm font-semibold text-slate-900 transition group-hover:text-slate-600 sm:text-base">
                    {product.name}
                  </h2>

                  {/* Price */}
                  {"price" in product && product.price != null && (
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formatPrice(product.price)}
                    </p>
                  )}

                  {/* View */}
                  <p className="mt-3 text-xs font-medium text-slate-500 transition group-hover:text-slate-900">
                    View product →
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
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>

            {pages.map((currentPage) => (
              <Button
                key={currentPage}
                type="button"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setPage(currentPage)}
                className="h-10 w-10 px-0"
              >
                {currentPage}
              </Button>
            ))}

            <Button
              type="button"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
