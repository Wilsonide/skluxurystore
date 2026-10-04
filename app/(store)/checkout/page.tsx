"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import PaystackPop from "@paystack/inline-js";

import { useCartStore } from "@/app/store/cart-store";
import { useAuthStore } from "@/app/store/auth-store";
import { OrderService } from "@/app/services/order.service";
import { PaymentService } from "@/app/services/payment.service";
import type { PaymentInitializeResponse } from "@/app/services/payment.service";

const CHECKOUT_DRAFT_KEY = "checkout_draft";
const PENDING_PAYMENT_KEY = "pending_checkout_payment";

interface CheckoutDraft {
  shippingAddress: string;
  phoneNumber: string;
}

interface PendingCheckoutPayment {
  orderId: number;
  payment: PaymentInitializeResponse;
  shippingAddress: string;
  phoneNumber: string;
  cartFingerprint: string;
  createdAt: string;
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

  // ============================================================
  // CART FINGERPRINT
  // ============================================================
  //
  // This identifies the exact cart that was used to create the
  // pending order.
  //
  // If the customer changes the cart after creating an order,
  // we do NOT resume the old payment against the new cart.
  //
  // ============================================================

  const createCartFingerprint = () => {
    return JSON.stringify(
      items
        .map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        }))
        .sort((a, b) => a.variant_id - b.variant_id),
    );
  };

  const currentCartFingerprint = createCartFingerprint();

  // ============================================================
  // RESTORE PENDING PAYMENT
  // ============================================================

  const [pendingPayment, setPendingPayment] =
    useState<PendingCheckoutPayment | null>(() => {
      if (typeof window === "undefined") {
        return null;
      }

      try {
        const savedPayment = sessionStorage.getItem(PENDING_PAYMENT_KEY);

        if (!savedPayment) {
          return null;
        }

        const parsed: PendingCheckoutPayment = JSON.parse(savedPayment);

        // ------------------------------------------------------
        // Validate basic structure
        // ------------------------------------------------------

        if (
          !parsed.orderId ||
          !parsed.payment?.access_code ||
          !parsed.payment?.reference
        ) {
          sessionStorage.removeItem(PENDING_PAYMENT_KEY);
          return null;
        }

        // ------------------------------------------------------
        // Make sure the pending payment belongs to the current
        // cart.
        // ------------------------------------------------------

        if (parsed.cartFingerprint !== currentCartFingerprint) {
          sessionStorage.removeItem(PENDING_PAYMENT_KEY);
          return null;
        }

        return parsed;
      } catch (error) {
        console.error("Failed to restore pending payment:", error);

        sessionStorage.removeItem(PENDING_PAYMENT_KEY);

        return null;
      }
    });

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
  // SAVE PENDING PAYMENT
  // ============================================================

  const savePendingPayment = (
    orderId: number,
    payment: PaymentInitializeResponse,
    address: string,
    phone: string,
  ) => {
    const pending: PendingCheckoutPayment = {
      orderId,
      payment,
      shippingAddress: address,
      phoneNumber: phone,
      cartFingerprint: currentCartFingerprint,
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(pending));

    setPendingPayment(pending);
  };

  // ============================================================
  // CLEAR PENDING PAYMENT
  // ============================================================

  const clearPendingPayment = () => {
    sessionStorage.removeItem(PENDING_PAYMENT_KEY);
    setPendingPayment(null);
  };

  // ============================================================
  // ERROR MESSAGE
  // ============================================================

  const getErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (
        error as {
          response?: {
            data?: {
              detail?: string;
              message?: string;
            };
          };
        }
      ).response;

      return (
        response?.data?.detail ??
        response?.data?.message ??
        "Unable to process your payment. Please try again."
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Unable to process your payment. Please try again.";
  };

  // ============================================================
  // OPEN PAYSTACK
  // ============================================================

  const openPaystackPayment = (payment: PaymentInitializeResponse) => {
    if (!payment.access_code) {
      setLoading(false);

      setError("Payment could not be opened. Please try again.");

      return;
    }

    const paystack = new PaystackPop();

    paystack.resumeTransaction(payment.access_code, {
      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      onSuccess: (transaction) => {
        setLoading(true);
        setError(null);

        const reference = transaction.reference || payment.reference;

        // ------------------------------------------------------
        // Do not clear the pending payment here.
        //
        // The success page is responsible for server-side
        // verification. It can clear the cart only after the
        // backend confirms that the payment succeeded.
        // ------------------------------------------------------

        router.push(
          `/payment/success?reference=${encodeURIComponent(reference)}`,
        );
      },

      // --------------------------------------------------------
      // CANCELLED / CLOSED
      // --------------------------------------------------------

      onCancel: () => {
        setLoading(false);

        setError(
          "Payment was cancelled. Your order has not been charged. You can try again when you're ready.",
        );
      },

      // --------------------------------------------------------
      // PAYSTACK ERROR
      // --------------------------------------------------------

      onError: (paystackError) => {
        console.error("Paystack error:", paystackError);

        setLoading(false);

        setError(
          paystackError?.message ??
            "We couldn't open the payment window. Please try again.",
        );
      },
    });
  };

  // ============================================================
  // PLACE ORDER + INITIALIZE / RESUME PAYMENT
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
    // PHONE VALIDATION
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
    // AUTHENTICATION
    // ----------------------------------------------------------

    if (!user) {
      saveCheckoutDraft();

      router.push(`/auth/login?from=${encodeURIComponent("/checkout")}`);

      return;
    }

    // ----------------------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // ----------------------------------------------------------

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // ========================================================
      // RESUME EXISTING PENDING PAYMENT
      // ========================================================

      if (pendingPayment) {
        // ------------------------------------------------------
        // Make sure the address/phone still belong to the
        // pending order.
        // ------------------------------------------------------

        if (
          pendingPayment.shippingAddress !== address ||
          pendingPayment.phoneNumber !== phone
        ) {
          setLoading(false);

          setError(
            "Your delivery information has changed since this payment was created. Please review your order before continuing.",
          );

          return;
        }

        // ------------------------------------------------------
        // Resume the exact same Paystack transaction.
        // ------------------------------------------------------

        openPaystackPayment(pendingPayment.payment);

        return;
      }

      // ========================================================
      // CREATE ORDER
      // ========================================================

      const order = await OrderService.create({
        shipping_address: address,
        phone_number: phone,
        items: items.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
      });

      // ========================================================
      // INITIALIZE PAYMENT
      // ========================================================

      const payment = await PaymentService.initialize(order.id);

      if (!payment.access_code) {
        throw new Error("Payment could not be initialized. Please try again.");
      }

      // ========================================================
      // PERSIST PENDING PAYMENT
      // ========================================================
      //
      // This survives a page refresh within the same browser
      // session.
      //
      // It contains enough information to resume the exact
      // transaction without creating another order.
      //
      // ========================================================

      savePendingPayment(order.id, payment, address, phone);

      // ========================================================
      // OPEN PAYSTACK
      // ========================================================

      openPaystackPayment(payment);
    } catch (error: unknown) {
      console.error("Checkout error:", error);

      setError(getErrorMessage(error));

      setLoading(false);
    }
  };

  // ============================================================
  // EMPTY CART
  // ============================================================

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
              Add products to your cart before checking out.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-obsidian px-6 py-3 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // CHECKOUT
  // ============================================================

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back to cart */}
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition hover:text-brand-obsidian"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium tracking-wide text-brand-champagne">
            Secure Checkout
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-obsidian">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-brand-muted">
            Enter your delivery information to place your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 lg:grid-cols-[1fr_380px]"
        >
          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="space-y-8">
            {/* DELIVERY */}
            <section className="rounded-2xl border border-brand-border bg-brand-warm-white p-6">
              <div className="border-b border-brand-border pb-5">
                <h2 className="text-lg font-semibold text-brand-obsidian">
                  Delivery Information
                </h2>

                <p className="mt-1 text-sm text-brand-muted">
                  Where should we deliver your order?
                </p>
              </div>

              <div className="mt-6 space-y-5">
                {/* PHONE */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-brand-espresso"
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
                    className="h-12 w-full rounded-xl border border-brand-border bg-brand-ivory px-4 text-sm text-brand-obsidian outline-none transition placeholder:text-brand-muted focus:border-brand-champagne focus:ring-2 focus:ring-brand-gold-soft disabled:bg-brand-cream"
                  />

                  <p className="mt-2 text-xs text-brand-muted">
                    Enter a valid phone number between 7 and 20 characters.
                  </p>
                </div>

                {/* ADDRESS */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-brand-espresso"
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
                    className="w-full resize-none rounded-xl border border-brand-border bg-brand-ivory px-4 py-3 text-sm text-brand-obsidian outline-none transition placeholder:text-brand-muted focus:border-brand-champagne focus:ring-2 focus:ring-brand-gold-soft disabled:bg-brand-cream"
                  />

                  <div className="mt-2 flex justify-between text-xs text-brand-muted">
                    <span>Minimum 5 characters</span>

                    <span>{shippingAddress.length}/500</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ORDER ITEMS */}
            <section className="rounded-2xl border border-brand-border bg-brand-warm-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-brand-obsidian">
                    Your Items
                  </h2>

                  <p className="mt-1 text-sm text-brand-muted">
                    Review your selection before payment.
                  </p>
                </div>

                <Link
                  href="/cart"
                  className="text-sm font-medium text-brand-champagne transition hover:text-brand-espresso"
                >
                  Edit cart
                </Link>
              </div>

              <div className="mt-6 divide-y divide-brand-border">
                {items.map((item) => (
                  <div
                    key={item.variant_id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-brand-obsidian">
                        {item.product_name}
                      </p>

                      {(item.color || item.size) && (
                        <p className="mt-1 text-sm text-brand-muted">
                          {item.color && `Color: ${item.color}`}
                          {item.color && item.size && " • "}
                          {item.size && `Size: ${item.size}`}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-brand-muted">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-semibold text-brand-espresso">
                      ₦{(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <aside className="h-fit rounded-2xl border border-brand-border bg-brand-warm-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-brand-obsidian">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {/* SUBTOTAL */}
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal</span>

                <span className="font-medium text-brand-espresso">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              {/* DELIVERY */}
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Delivery</span>

                <span className="max-w-[170px] text-right font-medium text-brand-espresso">
                  Calculated after order
                </span>
              </div>

              {/* TOTAL */}
              <div className="border-t border-brand-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-brand-obsidian">
                    Total
                  </span>

                  <span className="text-xl font-bold text-brand-obsidian">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* PENDING PAYMENT NOTICE */}
            {pendingPayment && (
              <div className="mt-6 rounded-xl border border-brand-gold-light bg-brand-cream p-4">
                <p className="text-sm font-semibold text-brand-espresso">
                  Payment awaiting completion
                </p>

                <p className="mt-1 text-xs leading-5 text-brand-muted-dark">
                  You already started payment for this order. You can continue
                  the same payment without creating another order.
                </p>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-5 text-red-700"
              >
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-obsidian px-6 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso disabled:cursor-not-allowed disabled:bg-brand-border-dark disabled:text-brand-muted"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening secure payment...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />

                  {pendingPayment
                    ? "Continue to Payment"
                    : user
                      ? "Proceed to Payment"
                      : "Login to Checkout"}
                </>
              )}
            </button>

            {/* PAYMENT MESSAGE */}
            <p className="mt-4 text-center text-xs leading-5 text-brand-muted">
              {user
                ? pendingPayment
                  ? "Your previous payment session is available. You can continue securely with the same transaction."
                  : "A secure Paystack payment window will open without leaving this checkout page."
                : "You need to sign in before proceeding to payment."}
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
