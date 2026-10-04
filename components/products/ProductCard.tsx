"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Loader2, ShoppingCart } from "lucide-react";

import type { ProductListItem } from "@/app/types/product";
import { useCartStore } from "@/app/store/cart-store";
import {
  ProductVariant,
  ProductVariantService,
} from "@/app/services/product-variant.service";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!product.is_available || isAdding || alreadyInCart) return;

    setIsAdding(true);
    setAdded(false);
    setError(null);

    try {
      const variants = await ProductVariantService.getByProduct(product.id);

      const availableVariants = variants.filter(
        (variant: ProductVariant) =>
          variant.is_available && variant.quantity > 0,
      );

      if (!availableVariants.length) {
        setError("Out of stock");
        return;
      }

      const variant =
        availableVariants.find((item) => item.is_default) ??
        availableVariants[0];

      // Check whether this exact variant is already in the cart.
      const existingCartItem = cartItems.find(
        (item) => item.variant_id === variant.id,
      );

      if (existingCartItem) {
        setAlreadyInCart(true);
        return;
      }

      addItem({
        variant_id: variant.id,
        product_id: product.id,
        product_name: product.name,
        sku: variant.sku!,
        price: variant.price,
        quantity: 1,
        stock: variant.quantity,
        cover_image: product.cover_image,
        color: variant.color,
        size: variant.size,
      });

      setAdded(true);
    } catch (err) {
      console.error("Failed to add product to cart:", err);
      setError("Unable to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  /*
   * Determine whether the product's default variant is already
   * in the cart when the component renders.
   *
   * ProductListItem does not contain variants, so we cannot know
   * the exact variant here without fetching them. The state is
   * therefore updated when the user clicks Add to Cart.
   */

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No image
            </div>
          )}

          {product.is_featured && (
            <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              Featured
            </span>
          )}

          {!product.is_available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                Out of stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold text-slate-900 transition hover:text-blue-600">
            {product.name}
          </h3>

          <p className="mt-2 text-sm text-slate-500">View product</p>
        </Link>

        {error && (
          <p className="mt-3 text-xs font-medium text-red-600">{error}</p>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.is_available || isAdding || added || alreadyInCart}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            !product.is_available
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : alreadyInCart
                ? "cursor-default bg-slate-100 text-slate-600"
                : added
                  ? "cursor-default bg-emerald-600 text-white"
                  : "bg-slate-950 text-white hover:bg-blue-600 active:scale-[0.98]"
          }`}
        >
          {isAdding ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : alreadyInCart ? (
            <>
              <Check className="h-4 w-4" />
              Already in Cart
            </>
          ) : added ? (
            <>
              <Check className="h-4 w-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}
