import { Axios } from "@/lib/axios";

import type {
  PaginatedProducts,
  Product,
  ProductCreate,
  ProductListItem,
  ProductQueryParams,
  ProductUpdate,
} from "@/app/types/product";

// ============================================================
// PRODUCT SERVICE
// ============================================================

export const ProductService = {
  // ----------------------------------------------------------
  // CREATE PRODUCT
  // ----------------------------------------------------------

  async create(data: ProductCreate): Promise<Product> {
    const response = await Axios.post<Product>("/products", data);

    return response.data;
  },

  // ----------------------------------------------------------
  // GET ALL PRODUCTS
  // ----------------------------------------------------------

  async getAll(params?: ProductQueryParams): Promise<PaginatedProducts> {
    const response = await Axios.get<PaginatedProducts>("/products", {
      params,
    });

    return response.data;
  },

  // ----------------------------------------------------------
  // SEARCH PRODUCTS
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
  // GET PRODUCT BY ID
  // ----------------------------------------------------------

  async getById(productId: number): Promise<Product> {
    const response = await Axios.get<Product>(`/products/${productId}`);

    return response.data;
  },

  // ----------------------------------------------------------
  // UPDATE PRODUCT
  // ----------------------------------------------------------

  async update(productId: number, data: ProductUpdate): Promise<Product> {
    const response = await Axios.patch<Product>(`/products/${productId}`, data);

    return response.data;
  },

  // ----------------------------------------------------------
  // DELETE PRODUCT
  // ----------------------------------------------------------

  async delete(productId: number): Promise<void> {
    await Axios.delete(`/products/${productId}`);
  },
};
