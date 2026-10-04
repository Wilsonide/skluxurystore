import { Axios } from "@/lib/axios";

// ============================================================
// REQUEST TYPES
// ============================================================

export interface PaymentInitializeRequest {
  order_id: number;
}

// ============================================================
// RESPONSE TYPES
// ============================================================

export interface PaymentInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

// ============================================================
// PAYMENT
// ============================================================

export interface Payment {
  id: number;
  order_id: number;

  reference: string;

  amount: string | number;

  status: string;

  channel?: string | null;

  paid_at?: string | null;

  created_at: string;

  updated_at?: string;
}

// ============================================================
// PAGINATION
// ============================================================

export interface PaymentPaginationParams {
  page?: number;
  page_size?: number;
}

export interface PaginatedPayments {
  items: Payment[];

  total: number;

  page: number;

  page_size: number;

  total_pages: number;
}

// ============================================================
// PAYMENT SERVICE
// ============================================================

export const PaymentService = {
  // ==========================================================
  // CUSTOMER
  // INITIALIZE PAYMENT
  // ==========================================================

  async initialize(orderId: number): Promise<PaymentInitializeResponse> {
    const response = await Axios.post<PaymentInitializeResponse>(
      "/payments/initialize",
      {
        order_id: orderId,
      },
    );

    return response.data;
  },

  // ==========================================================
  // CUSTOMER
  // VERIFY PAYMENT
  // ==========================================================

  async verify(reference: string): Promise<Payment> {
    const response = await Axios.get<Payment>(
      `/payments/verify/${encodeURIComponent(reference)}`,
    );

    return response.data;
  },

  // ==========================================================
  // CUSTOMER
  // MY PAYMENTS
  // ==========================================================

  async getMyPayments(): Promise<Payment[]> {
    const response = await Axios.get<Payment[]>("/payments/me");

    return response.data;
  },

  // ==========================================================
  // CUSTOMER
  // GET SINGLE PAYMENT
  // ==========================================================

  async getById(paymentId: number): Promise<Payment> {
    const response = await Axios.get<Payment>(`/payments/${paymentId}`);

    return response.data;
  },

  // ==========================================================
  // ADMIN
  // GET ALL PAYMENTS
  // ==========================================================

  async getAll(params?: PaymentPaginationParams): Promise<PaginatedPayments> {
    const response = await Axios.get<PaginatedPayments>("/admin/payments", {
      params,
    });

    return response.data;
  },

  // ==========================================================
  // ADMIN
  // GET SINGLE PAYMENT
  // ==========================================================

  async getAdminById(paymentId: number): Promise<Payment> {
    const response = await Axios.get<Payment>(`/admin/payments/${paymentId}`);

    return response.data;
  },
};
