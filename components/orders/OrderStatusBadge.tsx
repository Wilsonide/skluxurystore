"use client";

interface OrderStatusBadgeProps {
  status: string;
  type?: "order" | "payment";
}

export default function OrderStatusBadge({
  status,
  type = "order",
}: OrderStatusBadgeProps) {
  const normalized = status.toLowerCase();

  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",

    processing: "bg-blue-50 text-blue-700 border-blue-200",

    shipped: "bg-purple-50 text-purple-700 border-purple-200",

    delivered: "bg-green-50 text-green-700 border-green-200",

    completed: "bg-green-50 text-green-700 border-green-200",

    cancelled: "bg-red-50 text-red-700 border-red-200",

    paid: "bg-green-50 text-green-700 border-green-200",

    unpaid: "bg-yellow-50 text-yellow-700 border-yellow-200",

    failed: "bg-red-50 text-red-700 border-red-200",

    refunded: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[normalized] ?? "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {type === "payment" ? "Payment: " : ""}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
