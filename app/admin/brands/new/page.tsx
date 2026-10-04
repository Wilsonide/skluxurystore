/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BrandService } from "@/app/services/brand.service";

export default function NewBrandPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await BrandService.create({
        name: name.trim(),
        description: description.trim() || null,
        logo: logo.trim() || null,
      });

      router.push("/admin/brands");
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to create brand.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/brands"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to brands
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-950">New Brand</h1>

        <p className="mt-2 text-sm text-slate-500">
          Add a new brand to your store.
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
            Brand name
          </label>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            maxLength={255}
            placeholder="e.g. Casio"
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
            placeholder="Describe this brand..."
            className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Logo URL
          </label>

          <input
            value={logo}
            onChange={(event) => setLogo(event.target.value)}
            type="url"
            placeholder="https://..."
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-slate-900"
          />

          <p className="mt-2 text-xs text-slate-500">
            Optional. You can connect your image upload service later.
          </p>
        </div>

        {logo && (
          <div>
            <p className="mb-2 text-sm font-medium text-slate-900">Preview</p>

            <img
              src={logo}
              alt="Brand logo preview"
              className="h-20 w-20 rounded-lg border object-contain"
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/brands"
            className="rounded-lg border px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Brand"}
          </button>
        </div>
      </form>
    </main>
  );
}
