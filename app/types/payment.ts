export interface PaymentInitializeRequest {
  order_id: number;
}

export interface PaymentInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface Payment {
  id: number;

  order_id: number;

  amount: number;

  reference: string;

  status: string;

  payment_method?: string | null;

  created_at: string;
  updated_at?: string;
}
