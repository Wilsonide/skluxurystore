"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Box,
  CircleDollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { AnalyticsService } from "@/app/services/analytics.service";

import type { AnalyticsDashboard } from "@/app/services/analytics.service";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: string | number) {
  return `₦${Number(value).toLocaleString()}`;
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const result = await AnalyticsService.getDashboard();

        if (mounted) {
          setDashboard(result);
        }
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);

        if (mounted) {
          setError("Unable to load dashboard data.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />

            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>

          <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />

            <div>
              <h2 className="font-semibold text-red-900">
                Dashboard unavailable
              </h2>

              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Overview of your store performance.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboard.total_revenue)}
          icon={CircleDollarSign}
        />

        <StatCard
          title="Total Sales"
          value={dashboard.total_sales.toLocaleString()}
          icon={ShoppingCart}
        />

        <StatCard
          title="Items Sold"
          value={dashboard.total_items_sold.toLocaleString()}
          icon={Box}
        />

        <StatCard
          title="Best Sellers"
          value={dashboard.best_selling_products.length.toLocaleString()}
          icon={TrendingUp}
        />
      </div>

      {/* BEST SELLING PRODUCTS */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-950">
              Best-selling products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Products generating the most sales.
            </p>
          </div>

          <TrendingUp className="h-5 w-5 text-slate-400" />
        </div>

        {dashboard.best_selling_products.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center px-5">
            <div className="text-center">
              <Box className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                No sales yet
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Best-selling products will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {dashboard.best_selling_products.map((product, index) => (
              <div
                key={product.product_id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {product.product_name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Product #{product.product_id}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {product.total_sold.toLocaleString()}
                  </span>

                  <span className="text-xs text-slate-500">sold</span>

                  <ArrowUpRight className="ml-2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
