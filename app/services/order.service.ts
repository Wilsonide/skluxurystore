import { Axios } from "@/lib/axios";

import type {
  Order,
  OrderCreate,
  OrderPaginationParams,
  PaginatedOrders,
} from "@/app/types/order";

export const OrderService = {
  // ============================================================
  // CREATE ORDER
  // ============================================================

  async create(data: OrderCreate): Promise<Order> {
    const response = await Axios.post<Order>("/orders", data);

    return response.data;
  },

  // ============================================================
  // MY ORDERS
  // ============================================================

  async getMyOrders(params?: OrderPaginationParams): Promise<PaginatedOrders> {
    const response = await Axios.get<PaginatedOrders>("/orders/me", {
      params,
    });

    return response.data;
  },

  // ============================================================
  // MY SINGLE ORDER
  // ============================================================

  async getMyOrder(orderId: number): Promise<Order> {
    const response = await Axios.get<Order>(`/orders/me/${orderId}`);

    return response.data;
  },

  // ============================================================
  // ADMIN - ALL ORDERS
  // ============================================================

  async getAll(params?: OrderPaginationParams): Promise<PaginatedOrders> {
    const response = await Axios.get<PaginatedOrders>("/admin/orders", {
      params,
    });

    return response.data;
  },

  // ============================================================
  // ADMIN - SINGLE ORDER
  // ============================================================

  async getById(orderId: number): Promise<Order> {
    const response = await Axios.get<Order>(`/admin/orders/${orderId}`);

    return response.data;
  },
};
