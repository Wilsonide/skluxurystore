"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCartStore } from "@/app/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <ShoppingBag className="h-7 w-7 text-slate-500" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add some products to your cart and they&apos;ll appear here.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Shopping Cart
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review your items before checkout.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.variant_id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
