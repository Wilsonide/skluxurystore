export interface OrderItemCreate {
  variant_id: number;
  quantity: number;
}

export interface OrderCreate {
  shipping_address: string;
  phone_number: string;
  items: OrderItemCreate[];
}

export interface OrderItem {
  id: number;
  variant_id: number;
  quantity: number;
  price: string | number;

  // Optional enriched data if your backend adds it later
  variant?: {
    id: number;
    sku: string;
    price: string | number;
    color?: string | null;
    size?: string | null;
    product?: {
      id: number;
      name: string;
      cover_image?: string | null;
    };
  };
}

export interface Order {
  id: number;

  total_amount: string | number;

  status: string;

  payment_status: string;

  shipping_address: string;

  phone_number: string;

  user_id: string;

  created_at: string;

  updated_at: string;

  items: OrderItem[];
}

export interface PaginatedOrders {
  items: Order[];

  total: number;

  page: number;

  page_size: number;

  total_pages: number;
}

export interface OrderPaginationParams {
  page?: number;

  page_size?: number;
}
