"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { Order } from "@/app/types/order";

import OrderStatusBadge from "./OrderStatusBadge";

interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
}

export default function OrderTable({
  orders,
  loading = false,
}: OrderTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
        Loading orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center">
        <p className="font-medium text-slate-900">No orders found</p>

        <p className="mt-1 text-sm text-slate-500">
          Orders will appear here when customers place them.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Order
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Date
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Items
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Total
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                Payment
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">#{order.id}</p>

                  <p className="text-xs text-slate-500">{order.user_id}</p>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {order.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  )}
                </td>

                <td className="px-5 py-4 font-semibold">
                  ₦{Number(order.total_amount).toLocaleString()}
                </td>

                <td className="px-5 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>

                <td className="px-5 py-4">
                  <OrderStatusBadge
                    status={order.payment_status}
                    type="payment"
                  />
                </td>

                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-100"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
