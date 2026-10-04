"use client";

import Link from "next/link";
import { ArrowRight, CreditCard, Package } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-blue-600">My Account</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Account Overview
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Manage your orders and payments.
          </p>
        </div>

        {/* Account cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {/* Orders */}
          <Link
            href="/account/orders"
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Package className="h-6 w-6 text-blue-600" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-950">
              My Orders
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View your previous orders and track your purchases.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
              View orders
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Payments */}
          <Link
            href="/account/payments"
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-950">
              Payments
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View your payment history and transaction status.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
              View payments
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Quick navigation */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-950">Quick Actions</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Continue Shopping
            </Link>

            <Link
              href="/cart"
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
