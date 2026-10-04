/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { CategoryService } from "@/app/services/category.service";

export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await CategoryService.create({
        name: name.trim(),
        description: description.trim() || null,
      });

      router.push("/admin/categories");
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to categories
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-950">New Category</h1>

        <p className="mt-2 text-sm text-slate-500">
          Create a category for your products.
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
            placeholder="e.g. Wrist Watches"
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
            placeholder="Describe this category..."
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
            disabled={loading || !name.trim()}
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </main>
  );
}
