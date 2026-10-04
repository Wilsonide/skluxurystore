import { Axios } from "@/lib/axios";

export interface RevenueResponse {
  revenue: string | number;
}

export interface SalesResponse {
  sales: number;
}

export interface TotalItemsSoldResponse {
  total_items_sold: number;
}

export interface BestSellingProduct {
  product_id: number;
  product_name: string;
  total_sold: number;
}

export interface AnalyticsDashboard {
  total_revenue: string | number;
  total_sales: number;
  total_items_sold: number;
  best_selling_products: BestSellingProduct[];
}

export interface BestSellingProductParams {
  limit?: number;
  offset?: number;
}

export const AnalyticsService = {
  async getRevenue(): Promise<RevenueResponse> {
    const response = await Axios.get<RevenueResponse>("/analytics/revenue");

    return response.data;
  },

  async getSales(): Promise<SalesResponse> {
    const response = await Axios.get<SalesResponse>("/analytics/sales");

    return response.data;
  },

  async getItemsSold(): Promise<TotalItemsSoldResponse> {
    const response = await Axios.get<TotalItemsSoldResponse>(
      "/analytics/items-sold",
    );

    return response.data;
  },

  async getBestSellingProducts(
    params?: BestSellingProductParams,
  ): Promise<BestSellingProduct[]> {
    const response = await Axios.get<BestSellingProduct[]>(
      "/analytics/best-products",
      {
        params,
      },
    );

    return response.data;
  },

  async getDashboard(): Promise<AnalyticsDashboard> {
    const response = await Axios.get<AnalyticsDashboard>(
      "/analytics/dashboard",
    );

    return response.data;
  },
};
