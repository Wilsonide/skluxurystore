"use client";

import type { ProductVariant } from "@/app/types/product";

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: number | null;
  onChange: (variantId: number) => void;
}

export default function ProductVariantSelector({
  variants,
  selectedVariantId,
  onChange,
}: ProductVariantSelectorProps) {
  if (!variants.length) {
    return <p className="text-sm text-red-500">No variants available.</p>;
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Available Options
        </h3>

        <p className="text-xs text-slate-500">Select a variant</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {variants.map((variant) => {
          const selected = selectedVariantId === variant.id;

          const unavailable = !variant.is_available || variant.quantity <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={unavailable}
              onClick={() => onChange(variant.id)}
              className={`rounded-xl border p-3 text-left transition ${
                selected
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-400"
              } ${unavailable ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">
                  {variant.color || variant.size || variant.sku}
                </span>

                {variant.is_default && (
                  <span className="text-[10px] font-semibold uppercase text-blue-600">
                    Default
                  </span>
                )}
              </div>

              {variant.size && (
                <p className="mt-1 text-xs text-slate-500">
                  Size: {variant.size}
                </p>
              )}

              {variant.color && (
                <p className="mt-1 text-xs text-slate-500">
                  Color: {variant.color}
                </p>
              )}

              {variant.material && (
                <p className="mt-1 text-xs text-slate-500">
                  Material: {variant.material}
                </p>
              )}

              {variant.style && (
                <p className="mt-1 text-xs text-slate-500">
                  Style: {variant.style}
                </p>
              )}

              <p className="mt-2 font-semibold text-slate-900">
                ₦{Number(variant.price).toLocaleString()}
              </p>

              <p
                className={`mt-1 text-xs ${
                  unavailable ? "text-red-500" : "text-slate-500"
                }`}
              >
                {unavailable ? "Out of stock" : `${variant.quantity} available`}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
