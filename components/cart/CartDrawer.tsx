"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { useCartStore } from "@/app/store/cart-store";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);

  const totalItems = useCartStore((state) => state.getTotalItems());

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-slate-700" />

            <h2 className="font-semibold text-slate-900">Shopping Cart</h2>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {totalItems}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart content */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag size={42} className="text-slate-300" />

              <h3 className="mt-4 font-semibold text-slate-900">
                Your cart is empty
              </h3>

              <p className="mt-2 max-w-xs text-sm text-slate-500">
                Browse our products and add something you love to your cart.
              </p>

              <Link
                href="/products"
                onClick={onClose}
                className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.variant_id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="border-t bg-slate-50 p-5">
            <CartSummary showCheckoutButton onCheckout={onClose} />

            <Link
              href="/cart"
              onClick={onClose}
              className="mt-3 block text-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
