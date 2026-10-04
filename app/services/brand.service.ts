import { Axios } from "@/lib/axios";

export interface Brand {
  id: number;
  name: string;
  description?: string | null;
  logo?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BrandCreate {
  name: string;
  description?: string | null;
  logo?: string | null;
}

export interface BrandUpdate {
  name?: string;
  description?: string | null;
  logo?: string | null;
}

export const BrandService = {
  async create(data: BrandCreate): Promise<Brand> {
    const response = await Axios.post<Brand>("/brands", data);

    return response.data;
  },

  async getAll(): Promise<Brand[]> {
    const response = await Axios.get<Brand[]>("/brands");

    return response.data;
  },

  async getById(brandId: number): Promise<Brand> {
    const response = await Axios.get<Brand>(`/brands/${brandId}`);

    return response.data;
  },

  async update(brandId: number, data: BrandUpdate): Promise<Brand> {
    const response = await Axios.patch<Brand>(`/brands/${brandId}`, data);

    return response.data;
  },

  async delete(brandId: number): Promise<void> {
    await Axios.delete(`/brands/${brandId}`);
  },
};
