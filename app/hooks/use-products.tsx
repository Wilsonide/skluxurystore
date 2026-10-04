/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ProductService } from "@/app/services/product.service";

import type {
  PaginatedProducts,
  ProductQueryParams,
} from "@/app/types/product";

export function useProducts(params: ProductQueryParams = {}) {
  const [data, setData] = useState<PaginatedProducts | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /**
   * Normalize the query parameters.
   *
   * The URL/page is the source of truth,
   * so this hook does not maintain another
   * copy of the filter state.
   */
  const queryParams = useMemo<ProductQueryParams>(
    () => ({
      page: 1,
      page_size: 20,
      available: true,
      ...params,
    }),
    [
      params.page,
      params.page_size,
      params.search,
      params.category_id,
      params.brand_id,
      params.featured,
      params.available,
      params.min_price,
      params.max_price,
      params.sort,
    ],
  );

  /**
   * Fetch products.
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await ProductService.getAll(queryParams);

      setData(result);
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  /**
   * Fetch whenever query parameters change.
   */
  useEffect(() => {
    void Promise.resolve().then(() => fetchProducts());
  }, [fetchProducts]);

  return {
    /**
     * Lightweight products returned by
     * GET /products.
     *
     * These are ProductListItem[].
     */
    products: data?.items ?? [],

    /**
     * Pagination returned by FastAPI.
     */
    pagination: data
      ? {
          total: data.total,
          page: data.page,
          page_size: data.page_size,
          total_pages: data.total_pages,
          has_next: data.has_next,
          has_previous: data.has_previous,
        }
      : null,

    /**
     * Current request state.
     */
    loading,

    /**
     * API error.
     */
    error,

    /**
     * Manually reload products.
     */
    refetch: fetchProducts,
  };
}
