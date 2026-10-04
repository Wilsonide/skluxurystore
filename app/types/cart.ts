export interface CartItem {
  variant_id: number;

  product_id: number;

  product_name: string;

  sku: string;

  price: string | number;

  quantity: number;

  stock: number;

  cover_image?: string | null;

  color?: string | null;

  size?: string | null;
}

export interface AddToCartInput {
  variant_id: number;

  product_id: number;

  product_name: string;

  sku: string;

  price: string | number;

  quantity: number;

  stock: number;

  cover_image?: string | null;

  color?: string | null;

  size?: string | null;
}
