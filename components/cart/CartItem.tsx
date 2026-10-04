"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCartStore } from "@/app/store/cart-store";
import type { CartItem as CartItemType } from "@/app/types/cart";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const increaseQuantity = () => {
    updateQuantity(item.variant_id, item.quantity + 1);
  };

  const decreaseQuantity = () => {
    if (item.quantity <= 1) {
      removeItem(item.variant_id);
      return;
    }

    updateQuantity(item.variant_id, item.quantity - 1);
  };

  const handleRemove = () => {
    removeItem(item.variant_id);
  };

  const itemTotal = Number(item.price) * item.quantity;

  return (
    <div className="border-b border-slate-200 py-6 last:border-b-0">
      <div className="flex gap-4 sm:gap-5">
        {/* Product image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
          {item.cover_image ? (
            <Image
              src={item.cover_image}
              alt={item.product_name}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
              No image
            </div>
          )}
        </div>

        {/* Product content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                {item.product_name}
              </h3>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                SKU: {item.sku}
              </p>

              {(item.color || item.size) && (
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 sm:text-sm">
                  {item.color && (
                    <span>
                      <span className="text-slate-400">Color:</span>{" "}
                      {item.color}
                    </span>
                  )}

                  {item.size && (
                    <span>
                      <span className="text-slate-400">Size:</span> {item.size}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Clear remove action */}
            <button
              type="button"
              onClick={handleRemove}
              className="group flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              aria-label={`Remove ${item.product_name} from cart`}
            >
              <Trash2 className="h-4 w-4 transition group-hover:text-red-600" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>

          {/* Bottom controls */}
          <div className="mt-5 flex items-end justify-between gap-4">
            {/* Quantity */}
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-400">
                Quantity
              </p>

              <div className="flex h-9 items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="flex h-full w-9 items-center justify-center text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <span className="flex h-full min-w-9 items-center justify-center border-x border-slate-200 px-2 text-sm font-semibold text-slate-900">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={item.quantity >= item.stock}
                  className="flex h-full w-9 items-center justify-center text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-xs text-slate-400 sm:text-sm">
                ₦{Number(item.price).toLocaleString()} each
              </p>

              <p className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">
                ₦{itemTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
