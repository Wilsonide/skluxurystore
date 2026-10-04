"use client";

import { RotateCcw } from "lucide-react";

import type { ProductQueryParams } from "@/app/types/product";

interface FilterOption {
  id: number;
  name: string;
}

export interface ProductFilterValues {
  category_id?: number;
  brand_id?: number;
  featured?: boolean;
  available?: boolean;
  min_price?: number;
  max_price?: number;
  sort?: ProductQueryParams["sort"];
}

interface ProductFiltersProps {
  categories: FilterOption[];
  brands: FilterOption[];
  values: ProductFilterValues;
  onChange: (values: ProductFilterValues) => void;
}

export default function ProductFilters({
  categories,
  brands,
  values,
  onChange,
}: ProductFiltersProps) {
  const update = <K extends keyof ProductFilterValues>(
    key: K,
    value: ProductFilterValues[K],
  ) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  const reset = () => {
    onChange({
      available: true,
      sort: "newest",
    });
  };

  return (
    <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Filters</h2>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* CATEGORY */}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Category</label>

        <select
          value={values.category_id ?? ""}
          onChange={(event) =>
            update(
              "category_id",
              event.target.value ? Number(event.target.value) : undefined,
            )
          }
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* BRAND */}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Brand</label>

        <select
          value={values.brand_id ?? ""}
          onChange={(event) =>
            update(
              "brand_id",
              event.target.value ? Number(event.target.value) : undefined,
            )
          }
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All brands</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE */}

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">
          Price range
        </label>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={values.min_price ?? ""}
            onChange={(event) =>
              update(
                "min_price",
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="number"
            min={0}
            placeholder="Max"
            value={values.max_price ?? ""}
            onChange={(event) =>
              update(
                "max_price",
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* AVAILABILITY */}

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={values.available ?? false}
          onChange={(event) => update("available", event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />

        <span className="text-sm text-slate-700">In stock only</span>
      </label>

      {/* FEATURED */}

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={values.featured ?? false}
          onChange={(event) =>
            update("featured", event.target.checked ? true : undefined)
          }
          className="h-4 w-4 rounded border-slate-300"
        />

        <span className="text-sm text-slate-700">Featured products</span>
      </label>

      {/* SORT */}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Sort by</label>

        <select
          value={values.sort ?? "newest"}
          onChange={(event) =>
            update("sort", event.target.value as ProductQueryParams["sort"])
          }
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="newest">Newest</option>

          <option value="oldest">Oldest</option>

          <option value="price_asc">Price: Low to High</option>

          <option value="price_desc">Price: High to Low</option>

          <option value="name_asc">Name: A-Z</option>

          <option value="name_desc">Name: Z-A</option>
        </select>
      </div>
    </aside>
  );
}
