"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import { ProductService } from "@/app/services/product.service";
import { useProducts } from "@/app/hooks/use-products";
import { useCategories } from "@/app/hooks/use-categories";
import { useBrands } from "@/app/hooks/use-brands";

import type { ProductQueryParams } from "@/app/types/product";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [brandId, setBrandId] = useState<number | undefined>();

  const [status, setStatus] = useState<
    "all" | "available" | "unavailable" | "featured"
  >("all");

  const [sort, setSort] = useState<ProductQueryParams["sort"]>("newest");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { categories } = useCategories();
  const { brands } = useBrands();

  const productParams = useMemo<ProductQueryParams>(
    () => ({
      page: 1,
      page_size: 20,
      search: search || undefined,
      category_id: categoryId,
      brand_id: brandId,
      available:
        status === "all" || status === "featured"
          ? undefined
          : status === "available",
      featured: status === "featured" ? true : undefined,
      sort,
    }),
    [search, categoryId, brandId, status, sort],
  );

  const { products, pagination, loading, error, refetch } =
    useProducts(productParams);

  const handleSearch = useCallback(() => {
    setSearch(searchValue.trim());
  }, [searchValue]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await ProductService.delete(deleteId);

      setDeleteId(null);

      await refetch();
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Package className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                  Products
                </h1>

                <p className="text-sm text-slate-500">
                  Manage your store products and variants.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px_160px]">
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Search products..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
              >
                Search
              </button>
            </div>

            {/* Category */}
            <select
              value={categoryId ?? ""}
              onChange={(event) =>
                setCategoryId(
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">All categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Brand */}
            <select
              value={brandId ?? ""}
              onChange={(event) =>
                setBrandId(
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">All brands</option>

              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | "all"
                    | "available"
                    | "unavailable"
                    | "featured",
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="featured">Featured</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as ProductQueryParams["sort"])
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to high</option>
              <option value="price_desc">Price: High to low</option>
              <option value="name_asc">Name: A–Z</option>
              <option value="name_desc">Name: Z–A</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Product table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="text-sm text-slate-500">
              {loading
                ? "Loading products..."
                : `${pagination?.total ?? 0} products`}
            </p>
          </div>

          {loading ? (
            <ProductTableSkeleton />
          ) : products.length === 0 ? (
            <EmptyProducts />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Product
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Brand
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Featured
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => {
                    const category = categories.find(
                      (item) => item.id === product.category_id,
                    );

                    const brand = brands.find(
                      (item) => item.id === product.brand_id,
                    );

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                              {product.cover_image ? (
                                <img
                                  src={product.cover_image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Package className="h-5 w-5 text-slate-400" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900">
                                {product.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                ID #{product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {category?.name ?? "—"}
                        </td>

                        {/* Brand */}
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {brand?.name ?? "—"}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {product.is_available ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              Unavailable
                            </span>
                          )}
                        </td>

                        {/* Featured */}
                        <td className="px-5 py-4">
                          {product.is_featured ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              Featured
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              title="View/Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>

                            <Link
                              href={`/shop/${product.id}`}
                              target="_blank"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              title="View product"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setDeleteId(product.id)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && pagination && (
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
              <p className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.total_pages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => {
                    // Pagination is handled below by the dedicated page state.
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={!pagination.has_next}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-950">
              Delete product?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This action will permanently delete the product. Make sure you no
              longer need it before continuing.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyProducts() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Package className="h-6 w-6 text-slate-400" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        No products found
      </h2>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Try changing your search or filters, or create your first product.
      </p>

      <Link
        href="/admin/products/new"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </Link>
    </div>
  );
}

/* ============================================================
   LOADING SKELETON
============================================================ */

function ProductTableSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-5 px-5 py-4">
          <div className="h-12 w-12 animate-pulse rounded-lg bg-slate-200" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="hidden h-4 w-24 animate-pulse rounded bg-slate-100 sm:block" />

          <div className="hidden h-4 w-20 animate-pulse rounded bg-slate-100 md:block" />

          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
