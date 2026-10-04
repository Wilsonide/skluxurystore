"use client";

import { ProductVariant } from "@/app/types/product";

export interface VariantFormData {
  sku: string;
  price: number;
  quantity: number;

  color?: string;
  size?: string;
  material?: string;
  style?: string;
  strap_type?: string;

  is_default: boolean;
  is_available: boolean;
}

interface VariantFormProps {
  value: VariantFormData;
  onChange: (value: VariantFormData) => void;
  onRemove?: () => void;
  canRemove?: boolean;
}

export default function VariantForm({
  value,
  onChange,
  onRemove,
  canRemove = true,
}: VariantFormProps) {
  const update = (key: keyof VariantFormData, newValue: unknown) => {
    onChange({
      ...value,
      [key]: newValue,
    });
  };

  return (
    <div className="rounded-2xl border bg-slate-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Product Variant</h3>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* SKU */}
        <div>
          <label className="mb-1 block text-sm font-medium">SKU</label>

          <input
            value={value.sku}
            onChange={(event) => update("sku", event.target.value)}
            placeholder="SKU-001"
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="mb-1 block text-sm font-medium">Price</label>

          <input
            type="number"
            min={0}
            step="0.01"
            value={value.price}
            onChange={(event) => update("price", Number(event.target.value))}
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* QUANTITY */}
        <div>
          <label className="mb-1 block text-sm font-medium">Quantity</label>

          <input
            type="number"
            min={0}
            value={value.quantity}
            onChange={(event) => update("quantity", Number(event.target.value))}
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* COLOR */}
        <div>
          <label className="mb-1 block text-sm font-medium">Color</label>

          <input
            value={value.color ?? ""}
            onChange={(event) => update("color", event.target.value)}
            placeholder="Black"
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* SIZE */}
        <div>
          <label className="mb-1 block text-sm font-medium">Size</label>

          <input
            value={value.size ?? ""}
            onChange={(event) => update("size", event.target.value)}
            placeholder="42"
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* MATERIAL */}
        <div>
          <label className="mb-1 block text-sm font-medium">Material</label>

          <input
            value={value.material ?? ""}
            onChange={(event) => update("material", event.target.value)}
            placeholder="Leather"
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* STYLE */}
        <div>
          <label className="mb-1 block text-sm font-medium">Style</label>

          <input
            value={value.style ?? ""}
            onChange={(event) => update("style", event.target.value)}
            placeholder="Casual"
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* STRAP */}
        <div>
          <label className="mb-1 block text-sm font-medium">Strap type</label>

          <input
            value={value.strap_type ?? ""}
            onChange={(event) => update("strap_type", event.target.value)}
            placeholder="Leather strap"
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* OPTIONS */}
      <div className="mt-5 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value.is_default}
            onChange={(event) => update("is_default", event.target.checked)}
          />
          Default variant
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value.is_available}
            onChange={(event) => update("is_available", event.target.checked)}
          />
          Available
        </label>
      </div>
    </div>
  );
}
