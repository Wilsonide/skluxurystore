"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AddToCartInput, CartItem } from "@/app/types/cart";

interface CartStore {
  items: CartItem[];

  addItem: (item: AddToCartInput) => void;

  removeItem: (variantId: number) => void;

  updateQuantity: (variantId: number, quantity: number) => void;

  clearCart: () => void;

  getTotalItems: () => number;

  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // ======================================================
      // ADD
      // ======================================================

      addItem: (item) => {
        const existing = get().items.find(
          (cartItem) => cartItem.variant_id === item.variant_id,
        );

        if (existing) {
          const newQuantity = Math.min(
            existing.quantity + item.quantity,
            existing.stock,
          );

          set({
            items: get().items.map((cartItem) =>
              cartItem.variant_id === item.variant_id
                ? {
                    ...cartItem,
                    quantity: newQuantity,
                  }
                : cartItem,
            ),
          });

          return;
        }

        set({
          items: [
            ...get().items,
            {
              ...item,
              quantity: Math.min(item.quantity, item.stock),
            },
          ],
        });
      },

      // ======================================================
      // REMOVE
      // ======================================================

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variant_id !== variantId),
        });
      },

      // ======================================================
      // UPDATE QUANTITY
      // ======================================================

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);

          return;
        }

        set({
          items: get().items.map((item) =>
            item.variant_id === variantId
              ? {
                  ...item,
                  quantity: Math.min(quantity, item.stock),
                }
              : item,
          ),
        });
      },

      // ======================================================
      // CLEAR
      // ======================================================

      clearCart: () => {
        set({
          items: [],
        });
      },

      // ======================================================
      // TOTAL ITEMS
      // ======================================================

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // ======================================================
      // SUBTOTAL
      // ======================================================

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0,
        );
      },
    }),
    {
      name: "ecommerce-cart",
    },
  ),
);
