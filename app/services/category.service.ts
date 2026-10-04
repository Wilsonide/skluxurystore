import { Axios } from "@/lib/axios";

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryCreate {
  name: string;
  description?: string | null;
}

export interface CategoryUpdate {
  name?: string;
  description?: string | null;
}

export const CategoryService = {
  async create(data: CategoryCreate): Promise<Category> {
    const response = await Axios.post<Category>("/categories", data);

    return response.data;
  },

  async getAll(): Promise<Category[]> {
    const response = await Axios.get<Category[]>("/categories");

    return response.data;
  },

  async getById(categoryId: number): Promise<Category> {
    const response = await Axios.get<Category>(`/categories/${categoryId}`);

    return response.data;
  },

  async update(categoryId: number, data: CategoryUpdate): Promise<Category> {
    const response = await Axios.patch<Category>(
      `/categories/${categoryId}`,
      data,
    );

    return response.data;
  },

  async delete(categoryId: number): Promise<void> {
    await Axios.delete(`/categories/${categoryId}`);
  },
};
