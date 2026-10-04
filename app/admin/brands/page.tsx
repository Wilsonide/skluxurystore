/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { BrandService } from "@/app/services/brand.service";
import type { Brand } from "@/app/services/brand.service";

export default function AdminBrandsPage() {
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

  const handleDelete = async (brand: Brand) => {
    const confirmed = window.confirm(`Delete "${brand.name}"?`);

    if (!confirmed) return;

    try {
      await BrandService.delete(brand.id);

      setBrands((current) => current.filter((item) => item.id !== brand.id));
    } catch (error: any) {
      alert(error?.response?.data?.detail ?? "Failed to delete brand.");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Brands</h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage the brands available in your store.
          </p>
        </div>

        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Brand
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading brands...
          </div>
        ) : brands.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-medium text-slate-900">No brands found</p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first brand.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Brand</th>

                <th className="px-6 py-4 text-sm font-semibold">Description</th>

                <th className="px-6 py-4 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-10 w-10 rounded-lg object-contain"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                          {brand.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span className="font-medium text-slate-900">
                        {brand.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {brand.description || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/brands/${brand.id}/edit`}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        aria-label={`Edit ${brand.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(brand)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${brand.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
