"use client";

import Link from "next/link";
import { ArrowRight, CreditCard, Package } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-sm font-medium tracking-wide text-brand-champagne">
            My Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-obsidian">
            Account Overview
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-brand-muted">
            Manage your orders and payments.
          </p>
        </div>

        {/* Account cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {/* Orders */}
          <Link
            href="/account/orders"
            className="group rounded-2xl border border-brand-border bg-brand-warm-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-brand-border-dark hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-gold-light bg-brand-gold-soft">
              <Package className="h-6 w-6 text-brand-espresso" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-brand-obsidian">
              My Orders
            </h2>

            <p className="mt-2 text-sm leading-6 text-brand-muted">
              View your previous orders and track your purchases.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-brand-espresso">
              View orders
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Payments */}
          <Link
            href="/account/payments"
            className="group rounded-2xl border border-brand-border bg-brand-warm-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-brand-border-dark hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-border bg-brand-cream">
              <CreditCard className="h-6 w-6 text-brand-champagne" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-brand-obsidian">
              Payments
            </h2>

            <p className="mt-2 text-sm leading-6 text-brand-muted">
              View your payment history and transaction status.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-brand-espresso">
              View payments
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Quick navigation */}
        <div className="mt-8 rounded-2xl border border-brand-border bg-brand-warm-white p-6">
          <h2 className="font-semibold text-brand-obsidian">Quick Actions</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-lg bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
            >
              Continue Shopping
            </Link>

            <Link
              href="/cart"
              className="rounded-lg border border-brand-border bg-brand-warm-white px-5 py-3 text-sm font-semibold text-brand-espresso transition hover:bg-brand-cream"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
