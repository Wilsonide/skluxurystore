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
    if (!product.is_available || isAdding || alreadyInCart) {
      return;
    }

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

  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-border-dark hover:shadow-[0_14px_35px_rgba(23,18,15,0.10)]">
      {/* IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-brand-cream">
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-brand-muted">
              No image
            </div>
          )}

          {/* IMAGE OVERLAY */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-obsidian/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* FEATURED */}
          {product.is_featured && (
            <span className="absolute left-3 top-3 rounded-full border border-brand-champagne/40 bg-brand-obsidian/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-light shadow-sm backdrop-blur-sm">
              Featured
            </span>
          )}

          {/* OUT OF STOCK */}
          {!product.is_available && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-obsidian/45">
              <span className="rounded-full border border-brand-border bg-brand-warm-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-obsidian shadow-sm">
                Out of stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold leading-5 text-brand-obsidian transition-colors duration-200 hover:text-brand-champagne">
            {product.name}
          </h3>

          <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-brand-muted">
            View product
          </p>
        </Link>

        {/* ERROR */}
        {error && (
          <p className="mt-3 text-xs font-medium text-red-600">{error}</p>
        )}

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.is_available || isAdding || added || alreadyInCart}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            !product.is_available
              ? "cursor-not-allowed bg-brand-cream text-brand-muted"
              : alreadyInCart
                ? "cursor-default border border-brand-border bg-brand-cream text-brand-muted-dark"
                : added
                  ? "cursor-default bg-brand-espresso text-brand-gold-light"
                  : "bg-brand-obsidian text-brand-warm-white hover:bg-brand-espresso hover:text-brand-gold-light active:scale-[0.98]"
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
