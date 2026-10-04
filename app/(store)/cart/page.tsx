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
      <main className="min-h-screen bg-brand-ivory">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-border bg-brand-cream">
              <ShoppingBag className="h-7 w-7 text-brand-champagne" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-brand-obsidian">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm text-brand-muted">
              Add some products to your cart and they&apos;ll appear here.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-obsidian px-6 py-3 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium tracking-wide text-brand-champagne">
            Your Selection
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-obsidian">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-brand-muted">
            Review your items before checkout.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <div className="rounded-2xl border border-brand-border bg-brand-warm-white px-5 sm:px-6">
            <div className="border-b border-brand-border py-4">
              <p className="text-sm font-semibold text-brand-espresso">
                Cart Items
              </p>
            </div>

            <div>
              {items.map((item) => (
                <CartItem key={item.variant_id} item={item} />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <CartSummary />
          </div>
        </div>
      </div>
    </main>
  );
}
