/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  quantity: number;

  color?: string | null;
  size?: string | null;
  material?: string | null;
  style?: string | null;
  strap_type?: string | null;

  is_default: boolean;
  is_available: boolean;

  product?: {
    id: number;
    name: string;
    cover_image?: string | null;
  };
}

export interface Product {
  [x: string]: any;
  id: number;
  name: string;
  description: string;

  category_id: number;
  brand_id?: number | null;

  material?: string | null;
  gender?: string | null;
  warranty?: string | null;

  cover_image?: string | null;
  cover_public_id?: string | null;

  is_available: boolean;
  is_featured: boolean;

  created_at?: string;
  updated_at?: string;

  variants: ProductVariant[];
}

export interface ProductListItem {
  id: number;
  name: string;
  cover_image?: string | null;

  is_available: boolean;
  is_featured: boolean;

  category_id: number;
  brand_id?: number | null;
}

export type ProductSort =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

export interface ProductQueryParams {
  page?: number;
  page_size?: number;

  search?: string;

  category_id?: number;
  brand_id?: number;

  featured?: boolean;
  available?: boolean;

  min_price?: number;
  max_price?: number;

  sort?: ProductSort;
}

export interface PaginatedProducts {
  items: ProductListItem[];

  page: number;
  page_size: number;

  total: number;
  total_pages: number;

  has_next: boolean;
  has_previous: boolean;
}
