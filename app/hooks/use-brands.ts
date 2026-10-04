/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";

import { BrandService } from "@/app/services/brand.service";

import type { Brand } from "@/app/types/brand";

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await BrandService.getAll();

      setBrands(result);
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to load brands.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchBrands());
  }, [fetchBrands]);

  return {
    brands,
    loading,
    error,
    refetch: fetchBrands,
  };
}
