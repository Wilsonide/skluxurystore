/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { PaymentService } from "@/app/services/payment.service";

import type { Payment, PaymentInitializeResponse } from "@/app/types/payment";

export function usePayment() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [payment, setPayment] = useState<Payment | null>(null);

  const initializePayment = async (
    orderId: number,
  ): Promise<PaymentInitializeResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await PaymentService.initialize(orderId);

      return result;
    } catch (error: any) {
      setError(
        error?.response?.data?.detail ?? "Unable to initialize payment.",
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await PaymentService.verify(reference);

      setPayment({
        ...result,
        amount: Number(result.amount),
      });

      return result;
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Payment verification failed.");

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    payment,
    loading,
    error,

    initializePayment,
    verifyPayment,
  };
}
