"use client";

import Link from "next/link";

import { useCartStore } from "@/app/store/cart-store";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

export default function CartSummary({
  showCheckoutButton = true,
  onCheckout,
}: CartSummaryProps) {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const totalItems = useCartStore((state) => state.getTotalItems());

  const shipping: number = 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-border bg-brand-warm-white p-6">
        <h2 className="text-lg font-semibold text-brand-obsidian">
          Order Summary
        </h2>

        <p className="mt-4 text-sm text-brand-muted">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-warm-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-brand-obsidian">
          Order Summary
        </h2>

        <span className="text-xs font-medium uppercase tracking-wider text-brand-muted">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-muted">Items ({totalItems})</span>

          <span className="font-medium text-brand-espresso">
            ₦{subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-brand-muted">Shipping</span>

          <span className="font-medium text-brand-espresso">
            {shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="my-5 border-t border-brand-border" />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-brand-obsidian">Total</span>

        <span className="text-xl font-bold text-brand-obsidian">
          ₦{total.toLocaleString()}
        </span>
      </div>

      {showCheckoutButton && (
        <div className="mt-6">
          {onCheckout ? (
            <button
              type="button"
              onClick={onCheckout}
              className="w-full rounded-lg bg-brand-obsidian px-4 py-3 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
            >
              Proceed to Checkout
            </button>
          ) : (
            <Link
              href="/checkout"
              className="block w-full rounded-lg bg-brand-obsidian px-4 py-3 text-center text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
            >
              Proceed to Checkout
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
