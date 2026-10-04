/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/app/store/cart-store";
import { useAuthStore } from "@/app/store/auth-store";
import { OrderService } from "@/app/services/order.service";
import { PaymentService } from "@/app/services/payment.service";

const CHECKOUT_DRAFT_KEY = "checkout_draft";

interface CheckoutDraft {
  shippingAddress: string;
  phoneNumber: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);

  // ============================================================
  // RESTORE CHECKOUT DRAFT
  // ============================================================

  const [checkoutDraft] = useState<CheckoutDraft | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const savedDraft = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);

      if (!savedDraft) {
        return null;
      }

      const draft: CheckoutDraft = JSON.parse(savedDraft);

      // Remove the draft only after reading it successfully.
      sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);

      return draft;
    } catch (error) {
      console.error("Failed to restore checkout data:", error);
      sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
      return null;
    }
  });

  const [shippingAddress, setShippingAddress] = useState(
    checkoutDraft?.shippingAddress ?? "",
  );

  const [phoneNumber, setPhoneNumber] = useState(
    checkoutDraft?.phoneNumber ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // SUBTOTAL
  // ============================================================

  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  // ============================================================
  // SAVE CHECKOUT DRAFT
  // ============================================================

  const saveCheckoutDraft = () => {
    const draft: CheckoutDraft = {
      shippingAddress: shippingAddress.trim(),
      phoneNumber: phoneNumber.trim(),
    };

    sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
  };

  // ============================================================
  // PLACE ORDER + INITIALIZE PAYMENT
  // ============================================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // ----------------------------------------------------------
    // CART CHECK
    // ----------------------------------------------------------

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    // ----------------------------------------------------------
    // NORMALIZE INPUTS
    // ----------------------------------------------------------

    const address = shippingAddress.trim();
    const phone = phoneNumber.trim();

    // ----------------------------------------------------------
    // SHIPPING ADDRESS VALIDATION
    // Matches backend:
    // min_length=5
    // max_length=500
    // ----------------------------------------------------------

    if (address.length < 5) {
      setError("Shipping address must be at least 5 characters.");
      return;
    }

    if (address.length > 500) {
      setError("Shipping address must not exceed 500 characters.");
      return;
    }

    // ----------------------------------------------------------
    // PHONE NUMBER VALIDATION
    // Matches backend:
    // min_length=7
    // max_length=20
    // ----------------------------------------------------------

    if (phone.length < 7) {
      setError("Phone number must be at least 7 characters.");
      return;
    }

    if (phone.length > 20) {
      setError("Phone number must not exceed 20 characters.");
      return;
    }

    // ----------------------------------------------------------
    // AUTHENTICATION CHECK
    // ----------------------------------------------------------

    if (!user) {
      saveCheckoutDraft();

      router.push(`/auth/login?from=${encodeURIComponent("/checkout")}`);

      return;
    }

    // ----------------------------------------------------------
    // CREATE ORDER
    // ----------------------------------------------------------

    try {
      setLoading(true);

      const order = await OrderService.create({
        shipping_address: address,
        phone_number: phone,
        items: items.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
      });

      // --------------------------------------------------------
      // INITIALIZE PAYMENT
      //
      // The order has been created, but the customer has NOT
      // paid yet.
      //
      // Do not clear the cart here.
      // --------------------------------------------------------

      const payment = await PaymentService.initialize(order.id);

      // --------------------------------------------------------
      // REDIRECT TO PAYSTACK
      // --------------------------------------------------------

      if (!payment.authorization_url) {
        throw new Error("Payment could not be initialized. Please try again.");
      }

      window.location.href = payment.authorization_url;
    } catch (error: any) {
      setError(
        error?.response?.data?.detail ??
          error?.response?.data?.message ??
          error?.message ??
          "Unable to process your order. Please try again.",
      );

      setLoading(false);
    }
  };

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <ShoppingBag className="h-7 w-7 text-slate-500" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add products to your cart before checking out.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // CHECKOUT
  // ============================================================

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* BACK TO CART */}

      <Link
        href="/cart"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Enter your delivery information to place your order.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_380px]"
      >
        {/* ====================================================
            LEFT
        ==================================================== */}

        <div className="space-y-8">
          {/* DELIVERY */}

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Delivery Information
            </h2>

            <div className="mt-6 space-y-5">
              {/* PHONE */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="08012345678"
                  maxLength={20}
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Enter a valid phone number between 7 and 20 characters.
                </p>
              </div>

              {/* ADDRESS */}

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Shipping address
                </label>

                <textarea
                  id="address"
                  value={shippingAddress}
                  onChange={(event) => setShippingAddress(event.target.value)}
                  placeholder="Enter your complete delivery address"
                  rows={5}
                  maxLength={500}
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Minimum 5 characters</span>
                  <span>{shippingAddress.length}/500</span>
                </div>
              </div>
            </div>
          </section>

          {/* ORDER ITEMS */}

          <section className="rounded-2xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">
                Your Items
              </h2>

              <Link
                href="/cart"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Edit cart
              </Link>
            </div>

            <div className="mt-6 divide-y">
              {items.map((item) => (
                <div
                  key={item.variant_id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {item.product_name}
                    </p>

                    {(item.color || item.size) && (
                      <p className="mt-1 text-sm text-slate-500">
                        {item.color && `Color: ${item.color}`}

                        {item.color && item.size && " • "}

                        {item.size && `Size: ${item.size}`}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-slate-400">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 font-semibold text-slate-900">
                    ₦{(Number(item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ====================================================
            RIGHT
        ==================================================== */}

        <aside className="h-fit rounded-2xl border bg-white p-6 lg:sticky lg:top-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">
            {/* SUBTOTAL */}

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>

              <span className="font-medium text-slate-900">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>

            {/* DELIVERY */}

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery</span>

              <span className="font-medium text-slate-900">
                Calculated after order
              </span>
            </div>

            {/* TOTAL */}

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-950">Total</span>

                <span className="text-xl font-bold text-slate-950">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                {user ? "Preparing payment..." : "Redirecting to login..."}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />

                {user ? "Proceed to Payment" : "Login to Checkout"}
              </>
            )}
          </button>

          {/* PAYMENT MESSAGE */}

          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            {user
              ? "You will be redirected to our secure payment page to complete your purchase."
              : "You need to sign in before proceeding to payment."}
          </p>
        </aside>
      </form>
    </main>
  );
}
