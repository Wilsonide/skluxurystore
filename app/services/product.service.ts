import { Axios } from "@/lib/axios";

import type {
  PaginatedProducts,
  Product,
  ProductListItem,
  ProductQueryParams,
} from "@/app/types/product";

// ============================================================
// VARIANT TYPES
// ============================================================

export interface ProductVariantCreate {
  sku?: string;
  price: number;
  quantity: number;

  color?: string | null;
  size?: string | null;
  material?: string | null;
  style?: string | null;
  strap_type?: string | null;

  is_default?: boolean;
  is_available?: boolean;
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

  variants: ProductVariantCreate[];
}

// ============================================================
// PRODUCT UPDATE
// ============================================================

export interface ProductUpdate {
  name?: string;
  description?: string;

  category_id?: number;
  brand_id?: number | null;

  material?: string | null;
  gender?: string | null;
  warranty?: string | null;

  cover_image?: string | null;
  cover_public_id?: string | null;

  is_available?: boolean;
  is_featured?: boolean;
}

// ============================================================
// PRODUCT SERVICE
// ============================================================

export const ProductService = {
  // ----------------------------------------------------------
  // CREATE
  // ----------------------------------------------------------

  async create(data: ProductCreate): Promise<Product> {
    const response = await Axios.post<Product>("/products", data);

    return response.data;
  },

  // ----------------------------------------------------------
  // GET PRODUCTS
  // ----------------------------------------------------------

  async getAll(params?: ProductQueryParams): Promise<PaginatedProducts> {
    const response = await Axios.get<PaginatedProducts>("/products", {
      params,
    });

    return response.data;
  },

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  async search(query: string): Promise<ProductListItem[]> {
    const response = await Axios.get<ProductListItem[]>("/products/search", {
      params: {
        q: query,
      },
    });

    return response.data;
  },

  // ----------------------------------------------------------
  // GET SINGLE
  // ----------------------------------------------------------

  async getById(productId: number): Promise<Product> {
    const response = await Axios.get<Product>(`/products/${productId}`);

    return response.data;
  },

  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------

  async update(productId: number, data: ProductUpdate): Promise<Product> {
    const response = await Axios.patch<Product>(`/products/${productId}`, data);

    return response.data;
  },

  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------

  async delete(productId: number): Promise<void> {
    await Axios.delete(`/products/${productId}`);
  },
};
