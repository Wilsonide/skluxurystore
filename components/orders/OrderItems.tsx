"use client";

import { OrderItem } from "@/app/types/order";

interface OrderItemsProps {
  items: OrderItem[];
}

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="divide-y rounded-2xl border bg-white">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-4 p-4"
        >
          <div>
            <p className="font-medium text-slate-900">
              {item.variant?.product?.name ?? `Variant #${item.variant_id}`}
            </p>

            <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
              {item.variant?.sku && <span>SKU: {item.variant.sku}</span>}

              {item.variant?.color && <span>Color: {item.variant.color}</span>}

              {item.variant?.size && <span>Size: {item.variant.size}</span>}
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Quantity: {item.quantity}
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              ₦{Number(item.price).toLocaleString()}
            </p>

            <p className="text-xs text-slate-500">
              ₦{(Number(item.price) * item.quantity).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
