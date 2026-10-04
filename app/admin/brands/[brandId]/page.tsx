/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandService } from "@/app/services/brand.service";
import type { Brand } from "@/app/services/brand.service";

export default function EditBrandPage() {
  const params = useParams();
  const router = useRouter();

  const brandId = Number(params.brandId);

  const [brand, setBrand] = useState<Brand | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const hasValidBrandId = Number.isInteger(brandId);

  useEffect(() => {
    if (!hasValidBrandId) {
      return;
    }

    const loadBrand = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await BrandService.getById(brandId);

        setBrand(result);

        setName(result.name);
        setDescription(result.description ?? "");
        setLogo(result.logo ?? "");
      } catch (error: any) {
        setError(error?.response?.data?.detail ?? "Failed to load brand.");
      } finally {
        setLoading(false);
      }
    };

    void loadBrand();
  }, [brandId, hasValidBrandId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);

      await BrandService.update(brandId, {
        name: name.trim(),
        description: description.trim() || null,
        logo: logo.trim() || null,
      });

      router.push("/admin/brands");
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to update brand.");
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

  if (error && !brand) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-800">Unable to load brand</h1>

          <p className="mt-2 text-sm text-red-700">{error}</p>

          <Link
            href="/admin/brands"
            className="mt-5 inline-block text-sm font-medium text-slate-900 underline"
          >
            Back to brands
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/brands"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to brands
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-950">Edit Brand</h1>

        <p className="mt-2 text-sm text-slate-500">
          Update the brand information.
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
        </div>

        {logo && (
          <div>
            <p className="mb-2 text-sm font-medium text-slate-900">Preview</p>

            <img
              src={logo}
              alt={name || "Brand logo"}
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
