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
  description?: string;
  logo?: string;
}

export interface BrandUpdate {
  name?: string;
  description?: string;
  logo?: string;
}
