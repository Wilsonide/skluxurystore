/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { CategoryService } from "@/app/services/category.service";
import type { Category } from "@/app/types/category";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await CategoryService.getAll();
      setCategories(result);
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchCategories());
  }, [fetchCategories]);

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(`Delete "${category.name}"?`);

    if (!confirmed) return;

    try {
      await CategoryService.delete(category.id);

      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );
    } catch (error: any) {
      alert(error?.response?.data?.detail ?? "Failed to delete category.");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Categories</h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your product categories.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Category
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
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-medium text-slate-900">No categories found</p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first category.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Name</th>

                <th className="px-6 py-4 text-sm font-semibold">Description</th>

                <th className="px-6 py-4 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {category.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {category.description || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
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
