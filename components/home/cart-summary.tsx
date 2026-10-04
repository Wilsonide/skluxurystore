"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/features/store";
import { Button } from "@/components/ui/button";
import { clearCart } from "../../app/features/cart/cartSlice";

export default function CartSummary() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="rounded-2xl border p-8">
      <h2 className="text-2xl font-bold">Order Summary</h2>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping}</span>
        </div>

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <Button className="mt-8 w-full" onClick={() => dispatch(clearCart())}>
        Clear Cart
      </Button>
    </div>
  );
}
