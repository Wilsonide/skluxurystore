export interface Category {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;

  created_at?: string;
  updated_at?: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  image?: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  image?: string;
}
