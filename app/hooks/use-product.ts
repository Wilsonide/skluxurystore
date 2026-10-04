/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";

import { ProductService } from "@/app/services/product.service";

import type { Product } from "@/app/types/product";

export function useProduct(productId: number | undefined) {
  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(Boolean(productId));

  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await ProductService.getById(productId);

      setProduct(result);
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to load product.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchProduct());
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
