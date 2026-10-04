"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { PaymentService } from "@/app/services/payment.service";
import { useCartStore } from "@/app/store/cart-store";

type PaymentState = "verifying" | "success" | "failed";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearCart = useCartStore((state) => state.clearCart);

  const [status, setStatus] = useState<PaymentState>("verifying");

  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("failed");
        setMessage("Payment reference was not provided.");
        return;
      }

      try {
        const payment = await PaymentService.verify(reference);

        if (payment.status === "successful") {
          /**
           * Payment has been confirmed by Paystack.
           */
          clearCart();

          setStatus("success");
          setMessage("Your payment was successful.");

          /**
           * Redirect to the order page.
           *
           * The payment response contains order_id.
           */
          setTimeout(() => {
            router.push(`/account/orders/${payment.order_id}`);
          }, 1500);

          return;
        }

        setStatus("failed");
        setMessage("Your payment was not successful.");
      } catch (error) {
        console.error("Payment verification failed:", error);

        setStatus("failed");

        setMessage(
          "We could not verify your payment. Please contact support if money was deducted.",
        );
      }
    };

    verifyPayment();
  }, [searchParams, clearCart, router]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-brand-ivory px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-warm-white p-8 text-center shadow-sm">
        {/* VERIFYING */}
        {status === "verifying" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold-light bg-brand-gold-soft">
              <Loader2 className="h-8 w-8 animate-spin text-brand-champagne" />
            </div>

            <p className="mt-6 text-sm font-medium tracking-wide text-brand-champagne">
              Secure Payment
            </p>

            <h1 className="mt-1 text-2xl font-bold text-brand-obsidian">
              Verifying Payment
            </h1>

            <p className="mt-3 text-sm text-brand-muted">{message}</p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold-light bg-brand-gold-soft">
              <CheckCircle2 className="h-9 w-9 text-brand-champagne" />
            </div>

            <p className="mt-6 text-sm font-medium tracking-wide text-brand-champagne">
              Order Confirmed
            </p>

            <h1 className="mt-1 text-2xl font-bold text-brand-obsidian">
              Payment Successful
            </h1>

            <p className="mt-3 text-sm text-brand-muted">{message}</p>

            <p className="mt-4 text-xs text-brand-muted">
              Redirecting to your order...
            </p>
          </>
        )}

        {/* FAILED */}
        {status === "failed" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-50">
              <XCircle className="h-9 w-9 text-red-600" />
            </div>

            <p className="mt-6 text-sm font-medium tracking-wide text-red-600">
              Payment Issue
            </p>

            <h1 className="mt-1 text-2xl font-bold text-brand-obsidian">
              Payment Verification Failed
            </h1>

            <p className="mt-3 text-sm leading-6 text-brand-muted">{message}</p>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-6 rounded-xl bg-brand-obsidian px-6 py-3 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
            >
              Return to Checkout
            </button>
          </>
        )}
      </div>
    </main>
  );
}
