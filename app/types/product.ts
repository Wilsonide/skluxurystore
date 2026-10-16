export interface ProductVariantCreate {
  price: number;
  quantity?: number;

  color?: string | null;
  size?: string | null;

  is_default?: boolean;
  is_available?: boolean;
}

export interface ProductVariantUpdate {
  sku?: string | null;
  price?: number | null;
  quantity?: number | null;

  color?: string | null;
  size?: string | null;
  material?: string | null;
  style?: string | null;
  strap_type?: string | null;

  is_default?: boolean | null;
  is_available?: boolean | null;
}

export interface ProductVariant {
  id: number;
  product_id: number;

  price: number;
  quantity: number;

  color: string | null;
  size: string | null;

  is_default: boolean;
  is_available: boolean;

  created_at: string;
  updated_at: string;
}

// ============================================================
// PRODUCT IMAGES
// ============================================================

export interface ProductImageCreate {
  image_url: string;
  public_id?: string | null;
  sort_order?: number;
  is_cover?: boolean;
}

export interface ProductImage {
  id: number;
  image_url: string;
  public_id: string | null;
  product_id: number;
  sort_order: number;
  is_cover: boolean;
}

// ============================================================
// PRODUCT CREATE
// ============================================================

export interface ProductCreate {
  name: string;
  description: string;

  category_id: number;
  brand_id?: number | null;

  material?: string | null;
  gender?: string | null;
  warranty?: string | null;

  cover_image?: string | null;
  cover_public_id?: string | null;

  is_available?: boolean;
  is_featured?: boolean;

  variants?: ProductVariantCreate[];
  images?: ProductImageCreate[];
}

// ============================================================
// PRODUCT UPDATE
// ============================================================

export interface ProductUpdate {
  name?: string | null;
  description?: string | null;

  category_id?: number | null;
  brand_id?: number | null;

  material?: string | null;
  gender?: string | null;
  warranty?: string | null;

  cover_image?: string | null;
  cover_public_id?: string | null;

  is_available?: boolean | null;
  is_featured?: boolean | null;

  /**
   * undefined: leave existing gallery unchanged
   * []: remove all gallery images
   * populated array: replace/update gallery according
   * to the backend service implementation
   */
  images?: ProductImageCreate[] | null;
}

// ============================================================
// PRODUCT RESPONSE
// ============================================================

export interface Product {
  id: number;

  name: string;
  description: string;

  category_id: number;
  brand_id: number | null;

  material: string | null;
  gender: string | null;
  warranty: string | null;

  cover_image: string | null;
  cover_public_id: string | null;

  is_available: boolean;
  is_featured: boolean;

  created_at: string;
  updated_at: string;

  images: ProductImage[];
  variants: ProductVariant[];
}

// ============================================================
// PRODUCT LIST ITEM
// ============================================================

export interface ProductListItem {
  id: number;
  name: string;

  cover_image: string | null;

  is_available: boolean;
  is_featured: boolean;

  category_id: number;
  brand_id: number | null;

  images: ProductImage[];
}

// ============================================================
// PRODUCT QUERY AND PAGINATION
// ============================================================

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
