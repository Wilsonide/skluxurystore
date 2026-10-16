"use client";

import type { ProductVariant } from "@/app/types/product";

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: number | null;
  onChange: (variantId: number) => void;
}

function getVariantLabel(variant: ProductVariant): string {
  if (variant.color?.trim()) return variant.color;
  if (variant.size?.trim()) return `Size ${variant.size}`;
  if (variant.material?.trim()) return variant.material;
  return variant.sku?.trim() || `Variant #${variant.id}`;
}

export default function ProductVariantSelector({
  variants,
  selectedVariantId,
  onChange,
}: ProductVariantSelectorProps) {
  if (!variants.length) {
    return (
      <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
        No product variants are available.
      </p>
    );
  }

  return (
    <section className="space-y-4" aria-label="Product variants">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Available Options
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Select an option to view its price and availability.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {variants.map((variant) => {
          const selected = selectedVariantId === variant.id;
          const unavailable =
            !variant.is_available || Number(variant.quantity) <= 0;

          const label = getVariantLabel(variant);

          return (
            <button
              key={variant.id}
              type="button"
              disabled={unavailable}
              aria-pressed={selected}
              aria-label={`${label}, ${
                unavailable ? "out of stock" : "available"
              }`}
              onClick={() => onChange(variant.id)}
              className={[
                "relative rounded-xl border p-4 text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                selected
                  ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm",
                unavailable
                  ? "cursor-not-allowed bg-slate-50 opacity-60"
                  : "cursor-pointer",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {label}
                  </p>

                  {variant.sku?.trim() && (
                    <p className="mt-1 text-xs text-slate-500">
                      SKU: {variant.sku}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  {variant.is_default && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                      Default
                    </span>
                  )}

                  {selected && (
                    <span className="text-xs font-semibold text-blue-700">
                      Selected
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {variant.size && variant.color && (
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    Size: {variant.size}
                  </span>
                )}

                {variant.color && label !== variant.color && (
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    Color: {variant.color}
                  </span>
                )}

                {variant.size &&
                  label !== `Size ${variant.size}` &&
                  !variant.color && (
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      Size: {variant.size}
                    </span>
                  )}

                {variant.material && (
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    Material: {variant.material}
                  </span>
                )}

                {variant.style && (
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    Style: {variant.style}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-200/80 pt-3">
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    ₦{Number(variant.price).toLocaleString("en-NG")}
                  </p>

                  <p
                    className={`mt-1 text-xs font-medium ${
                      unavailable ? "text-red-600" : "text-emerald-700"
                    }`}
                  >
                    {unavailable
                      ? "Out of stock"
                      : `${Number(variant.quantity).toLocaleString("en-NG")} available`}
                  </p>
                </div>

                {selected && (
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm text-white"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
