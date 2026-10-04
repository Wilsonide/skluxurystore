"use client";

import { Order } from "@/app/types/order";

import OrderStatusBadge from "./OrderStatusBadge";

interface OrderSummaryProps {
  order: Order;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Order</p>

          <h2 className="text-xl font-bold text-slate-900">#{order.id}</h2>

          <p className="mt-1 text-sm text-slate-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.status} />

          <OrderStatusBadge status={order.payment_status} type="payment" />
        </div>
      </div>

      <div className="mt-6 grid gap-5 border-t pt-6 md:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">
            Customer
          </p>

          <p className="mt-1 text-sm text-slate-700">{order.user_id}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Phone</p>

          <p className="mt-1 text-sm text-slate-700">{order.phone_number}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Total</p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            ₦{Number(order.total_amount).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase text-slate-400">
          Shipping address
        </p>

        <p className="mt-1 text-sm text-slate-700">{order.shipping_address}</p>
      </div>
    </div>
  );
}
