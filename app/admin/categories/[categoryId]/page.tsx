/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CategoryService } from "@/app/services/category.service";
import type { Category } from "@/app/types/category";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();

  const categoryId = Number(params.categoryId);

  const [category, setCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const isValidCategoryId = Number.isInteger(categoryId);

  useEffect(() => {
    if (!isValidCategoryId) {
      return;
    }

    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await CategoryService.getById(categoryId);

        setCategory(result);
        setName(result.name);
        setDescription(result.description ?? "");
      } catch (error: any) {
        setError(error?.response?.data?.detail ?? "Failed to load category.");
      } finally {
        setLoading(false);
      }
    };

    void loadCategory();
  }, [categoryId, isValidCategoryId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);

      await CategoryService.update(categoryId, {
        name: name.trim(),
        description: description.trim() || null,
      });

      router.push("/admin/categories");
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-5">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-12 animate-pulse rounded bg-slate-200" />
          <div className="h-32 animate-pulse rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error && !category) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-800">
            Unable to load category
          </h1>

          <p className="mt-2 text-sm text-red-700">{error}</p>

          <Link
            href="/admin/categories"
            className="mt-5 inline-block text-sm font-medium text-slate-900 underline"
          >
            Back to categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to categories
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-950">
          Edit Category
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Update the category information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-white p-6"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Category name
          </label>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            maxLength={255}
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/categories"
            className="rounded-lg border px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
