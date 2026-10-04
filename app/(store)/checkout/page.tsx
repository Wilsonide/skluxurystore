"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/app/store/cart-store";
import { useAuthStore } from "@/app/store/auth-store";
import { OrderService } from "@/app/services/order.service";
import {
  PaymentService,
  type PaymentInitializeResponse,
} from "@/app/services/payment.service";

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

  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pendingPayment, setPendingPayment] =
    useState<PendingCheckoutPayment | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * ---------------------------------------------------------
   * CART FINGERPRINT
   * ---------------------------------------------------------
   */

  const currentCartFingerprint = useMemo(() => {
    return JSON.stringify(
      items
        .map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        }))
        .sort((a, b) => a.variant_id - b.variant_id),
    );
  }, [items]);

  /*
   * ---------------------------------------------------------
   * RESTORE SAVED CHECKOUT INFORMATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);

      if (!savedDraft) {
        return;
      }

      const draft: CheckoutDraft = JSON.parse(savedDraft);

      window.setTimeout(() => {
        setShippingAddress(draft.shippingAddress ?? "");
        setPhoneNumber(draft.phoneNumber ?? "");
      }, 0);

      sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    } catch (error) {
      console.error("Failed to restore checkout draft:", error);

      sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * RESTORE PENDING PAYMENT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    try {
      const savedPayment = sessionStorage.getItem(PENDING_PAYMENT_KEY);

      if (!savedPayment) {
        return;
      }

      const parsed: PendingCheckoutPayment = JSON.parse(savedPayment);

      if (
        !parsed.orderId ||
        !parsed.payment?.access_code ||
        !parsed.payment?.reference ||
        !parsed.cartFingerprint
      ) {
        sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        return;
      }

      /*
       * Do not resume a payment if the cart has changed.
       */
      if (parsed.cartFingerprint !== currentCartFingerprint) {
        sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        return;
      }

      window.setTimeout(() => {
        setPendingPayment(parsed);
        setShippingAddress(
          (current) => current || parsed.shippingAddress || "",
        );
        setPhoneNumber((current) => current || parsed.phoneNumber || "");
      }, 0);
    } catch (error) {
      console.error("Failed to restore pending payment:", error);

      sessionStorage.removeItem(PENDING_PAYMENT_KEY);
    }
  }, [currentCartFingerprint]);

  /*
   * ---------------------------------------------------------
   * TOTAL
   * ---------------------------------------------------------
   */

  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  /*
   * ---------------------------------------------------------
   * SAVE CHECKOUT DRAFT
   * ---------------------------------------------------------
   */

  const saveCheckoutDraft = () => {
    const draft: CheckoutDraft = {
      shippingAddress: shippingAddress.trim(),
      phoneNumber: phoneNumber.trim(),
    };

    sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
  };

  /*
   * ---------------------------------------------------------
   * SAVE PENDING PAYMENT
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * CLEAR PENDING PAYMENT
   * ---------------------------------------------------------
   */

  const clearPendingPayment = () => {
    sessionStorage.removeItem(PENDING_PAYMENT_KEY);
    setPendingPayment(null);
  };

  /*
   * ---------------------------------------------------------
   * ERROR MESSAGE
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * OPEN PAYSTACK
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * There is NO top-level import of @paystack/inline-js.
   *
   * Paystack is imported only after the user clicks
   * the payment button.
   */

  const openPaystackPayment = async (payment: PaymentInitializeResponse) => {
    if (!payment.access_code) {
      setLoading(false);
      setError("Payment could not be opened. Please try again.");
      return;
    }

    try {
      const { default: PaystackPop } = await import("@paystack/inline-js");

      const paystack = new PaystackPop();

      paystack.resumeTransaction(payment.access_code, {
        onSuccess: (transaction) => {
          const reference = transaction.reference || payment.reference;

          router.push(
            `/payment/success?reference=${encodeURIComponent(reference)}`,
          );
        },

        onCancel: () => {
          setLoading(false);

          setError("Payment was cancelled. Your order has not been charged.");
        },

        onError: (paystackError) => {
          console.error("Paystack error:", paystackError);

          setLoading(false);

          setError(
            paystackError?.message ??
              "We couldn't open the payment window. Please try again.",
          );
        },
      });
    } catch (error) {
      console.error("Failed to load Paystack:", error);

      setLoading(false);

      setError("We couldn't open the payment window. Please try again.");
    }
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT CHECKOUT
   * ---------------------------------------------------------
   */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    const address = shippingAddress.trim();
    const phone = phoneNumber.trim();

    if (address.length < 5) {
      setError("Shipping address must be at least 5 characters.");
      return;
    }

    if (phone.length < 7) {
      setError("Phone number must be at least 7 characters.");
      return;
    }

    if (!user) {
      saveCheckoutDraft();

      router.push(`/auth/login?from=${encodeURIComponent("/checkout")}`);

      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      /*
       * Resume an existing payment instead of creating
       * another order.
       */
      if (pendingPayment) {
        if (pendingPayment.cartFingerprint !== currentCartFingerprint) {
          clearPendingPayment();

          setLoading(false);

          setError(
            "Your cart has changed since this payment was created. Please place the order again.",
          );

          return;
        }

        if (
          pendingPayment.shippingAddress !== address ||
          pendingPayment.phoneNumber !== phone
        ) {
          setLoading(false);

          setError(
            "Your delivery information has changed since this payment was created.",
          );

          return;
        }

        await openPaystackPayment(pendingPayment.payment);

        return;
      }

      /*
       * Create order.
       */
      const order = await OrderService.create({
        shipping_address: address,
        phone_number: phone,
        items: items.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
      });

      /*
       * Initialize payment.
       */
      const payment = await PaymentService.initialize(order.id);

      if (!payment.access_code) {
        throw new Error("Payment could not be initialized. Please try again.");
      }

      /*
       * Save payment before opening Paystack.
       */
      savePendingPayment(order.id, payment, address, phone);

      /*
       * Open Paystack.
       */
      await openPaystackPayment(payment);
    } catch (error) {
      console.error("Checkout error:", error);

      setError(getErrorMessage(error));
      setLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * EMPTY CART
   * ---------------------------------------------------------
   */

  if (!items.length) {
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

  /*
   * ---------------------------------------------------------
   * CHECKOUT
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition hover:text-brand-obsidian"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>

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
          <div className="space-y-8">
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
                </div>

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

                  <div className="mt-2 text-right text-xs text-brand-muted">
                    {shippingAddress.length}/500
                  </div>
                </div>
              </div>
            </section>

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

          <aside className="h-fit rounded-2xl border border-brand-border bg-brand-warm-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-brand-obsidian">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal</span>

                <span className="font-medium text-brand-espresso">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Delivery</span>

                <span className="text-right font-medium text-brand-espresso">
                  Calculated after order
                </span>
              </div>

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

            {pendingPayment && (
              <div className="mt-6 rounded-xl border border-brand-gold-light bg-brand-cream p-4">
                <p className="text-sm font-semibold text-brand-espresso">
                  Payment awaiting completion
                </p>

                <p className="mt-1 text-xs leading-5 text-brand-muted-dark">
                  You already started payment for this order. Continue to
                  payment to complete the transaction.
                </p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-5 text-red-700"
              >
                {error}
              </div>
            )}

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

            <p className="mt-4 text-center text-xs leading-5 text-brand-muted">
              {user
                ? "Your payment is securely processed through Paystack."
                : "You need to sign in before proceeding to payment."}
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
