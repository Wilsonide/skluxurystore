import { Axios } from "@/lib/axios";

export interface ProductVariant {
  id: number;
  product_id: number;
  sku?: string;
  price: string | number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  material?: string | null;
  style?: string | null;
  strap_type?: string | null;
  is_default: boolean;
  is_available: boolean;
}

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

export interface ProductVariantUpdate {
  sku?: string;
  price?: number;
  quantity?: number;
  color?: string | null;
  size?: string | null;
  material?: string | null;
  style?: string | null;
  strap_type?: string | null;
  is_default?: boolean;
  is_available?: boolean;
}

export const ProductVariantService = {
  async create(
    productId: number,
    data: ProductVariantCreate,
  ): Promise<ProductVariant> {
    const response = await Axios.post<ProductVariant>(
      `/products/${productId}/variants`,
      data,
    );

    return response.data;
  },

  async getByProduct(productId: number): Promise<ProductVariant[]> {
    const response = await Axios.get<ProductVariant[]>(
      `/products/${productId}/variants`,
    );

    return response.data;
  },

  async getById(variantId: number): Promise<ProductVariant> {
    const response = await Axios.get<ProductVariant>(
      `/products/variants/${variantId}`,
    );

    return response.data;
  },

  async update(
    variantId: number,
    data: ProductVariantUpdate,
  ): Promise<ProductVariant> {
    const response = await Axios.patch<ProductVariant>(
      `/products/variants/${variantId}`,
      data,
    );

    return response.data;
  },

  async delete(variantId: number): Promise<void> {
    await Axios.delete(`/products/variants/${variantId}`);
  },
};
