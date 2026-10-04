"use client";

import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";

import { Order } from "@/app/types/order";

import OrderStatusBadge from "./OrderStatusBadge";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold text-slate-900">Order #{order.id}</p>

            <p className="mt-1 text-xs text-slate-500">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-400" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <OrderStatusBadge status={order.status} />

        <OrderStatusBadge status={order.payment_status} type="payment" />
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-sm text-slate-500">
          {order.items.length} item
          {order.items.length !== 1 ? "s" : ""}
        </span>

        <span className="font-bold text-slate-900">
          ₦{Number(order.total_amount).toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
