"use client";

import { useCartStore } from "@/app/store/cart-store";
import Link from "next/link";

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
      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        <p className="mt-4 text-sm text-slate-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Items ({totalItems})</span>

          <span className="font-medium">₦{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Shipping</span>

          <span className="font-medium">
            {shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="my-5 border-t" />

      <div className="flex items-center justify-between">
        <span className="font-semibold">Total</span>

        <span className="text-xl font-bold text-slate-900">
          ₦{total.toLocaleString()}
        </span>
      </div>

      {showCheckoutButton && (
        <div className="mt-6">
          {onCheckout ? (
            <button
              type="button"
              onClick={onCheckout}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Proceed to Checkout
            </button>
          ) : (
            <Link
              href="/checkout"
              className="block w-full rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Proceed to Checkout
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
