"use client";

import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";

import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../app/features/cart/cartSlice";

export default function CartItem({ item }: any) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-2xl border p-6">
      {/* IMAGE */}
      <img
        src={
          item.image_url ||
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f"
        }
        alt={item.title}
        className="h-36 w-28 rounded-xl object-cover"
      />

      {/* CONTENT */}
      <div className="flex-1 w-full">
        <h3 className="text-xl md:text-2xl font-semibold">{item.title}</h3>

        <div className="mt-3 text-sm text-slate-500">
          Unit Price: ${item.price}
        </div>

        <div className="mt-2 text-lg font-bold">
          Total: ${(item.price * item.quantity).toFixed(2)}
        </div>

        {/* QUANTITY CONTROLS */}
        <div className="mt-5 flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(decreaseQty(item.id))}
          >
            -
          </Button>

          <span className="min-w-[30px] text-center text-lg font-semibold">
            {item.quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(increaseQty(item.id))}
          >
            +
          </Button>
        </div>
      </div>

      {/* REMOVE */}
      <Button
        variant="destructive"
        onClick={() => dispatch(removeFromCart(item.id))}
        className="w-full sm:w-auto"
      >
        Remove
      </Button>
    </div>
  );
}
