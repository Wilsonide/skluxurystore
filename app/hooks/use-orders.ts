/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";

import { OrderService } from "@/app/services/order.service";

import type { Order, OrderCreate, PaginatedOrders } from "@/app/types/order";

interface UseOrdersOptions {
  admin?: boolean;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { admin = false, page = 1, pageSize = 20, enabled = true } = options;

  const [data, setData] = useState<PaginatedOrders | null>(null);

  const [loading, setLoading] = useState(enabled);

  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = admin
        ? await OrderService.getAll({
            page,
            page_size: pageSize,
          })
        : await OrderService.getMyOrders({
            page,
            page_size: pageSize,
          });

      setData(result);
    } catch (error: any) {
      setError(error?.response?.data?.detail ?? "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [admin, page, pageSize, enabled]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchOrders());
  }, [fetchOrders]);

  const createOrder = async (orderData: OrderCreate): Promise<Order> => {
    try {
      const order = await OrderService.create(orderData);

      await fetchOrders();

      return order;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.detail ?? "Failed to create order.",
      );
    }
  };

  return {
    orders: data?.items ?? [],

    pagination: data
      ? {
          total: data.total,
          page: data.page,
          page_size: data.page_size,
          total_pages: data.total_pages,
        }
      : null,

    loading,

    error,

    createOrder,

    refetch: fetchOrders,
  };
}
