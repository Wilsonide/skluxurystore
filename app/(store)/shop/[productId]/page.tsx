"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import ProductGallery from "@/components/products/ProductGallery";
import ProductVariantSelector from "@/components/products/ProductVariantSelector";
import { useProduct } from "@/app/hooks/use-product";
import { useCartStore } from "@/app/store/cart-store";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const productId = Number(params.productId);

  const { product, loading, error } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 h-5 w-28 animate-pulse rounded bg-brand-cream" />

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-brand-cream" />

            <div className="space-y-6 py-2">
              <div className="h-4 w-24 animate-pulse rounded bg-brand-cream" />
              <div className="h-10 w-2/3 animate-pulse rounded bg-brand-cream" />
              <div className="h-7 w-32 animate-pulse rounded bg-brand-cream" />
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-brand-cream" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-brand-cream" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-brand-cream" />
              </div>
              <div className="h-32 animate-pulse rounded-xl bg-brand-cream" />
              <div className="h-14 animate-pulse rounded-xl bg-brand-cream" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-border bg-brand-warm-white">
            <ShoppingCart className="h-6 w-6 text-brand-champagne" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-brand-obsidian">
            Product not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-brand-muted">
            The product may have been removed or is no longer available.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex items-center rounded-xl bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-warm-white transition-colors hover:bg-brand-espresso hover:text-brand-gold-light"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const variants = product.variants ?? [];

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    variants.find(
      (variant) =>
        variant.is_default && variant.is_available && variant.quantity > 0,
    ) ??
    variants.find((variant) => variant.is_available && variant.quantity > 0);

  const handleVariantChange = (variantId: number) => {
    setSelectedVariantId(variantId);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      return;
    }

    addItem({
      variant_id: selectedVariant.id,
      product_id: product.id,
      product_name: product.name,
      sku: selectedVariant.sku,
      price: selectedVariant.price,
      quantity,
      stock: selectedVariant.quantity,
      cover_image: product.cover_image,
      color: selectedVariant.color,
      size: selectedVariant.size,
    });

    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-obsidian"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Product Gallery */}
          <div>
            <ProductGallery product={product} />
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            {/* Product identity */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-champagne">
                {product.category?.name ?? "Collection"}
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-brand-obsidian sm:text-4xl">
                {product.name}
              </h1>

              {selectedVariant && (
                <p className="mt-5 text-2xl font-semibold tracking-tight text-brand-obsidian">
                  ₦{Number(selectedVariant.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-7 border-t border-brand-border pt-7">
                <p className="max-w-xl text-sm leading-7 text-brand-muted-dark">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mt-8 border-t border-brand-border pt-8">
                <ProductVariantSelector
                  variants={variants}
                  selectedVariantId={selectedVariant?.id ?? null}
                  onChange={handleVariantChange}
                />
              </div>
            )}

            {/* Quantity */}
            {selectedVariant && (
              <div className="mt-8 border-t border-brand-border pt-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand-obsidian">
                    Quantity
                  </p>

                  <p className="text-xs text-brand-muted">
                    {selectedVariant.quantity} available
                  </p>
                </div>

                <div className="mt-3 flex w-fit items-center overflow-hidden rounded-xl border border-brand-border bg-brand-warm-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="flex h-11 w-11 items-center justify-center text-lg text-brand-espresso transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span className="flex h-11 min-w-12 items-center justify-center border-x border-brand-border px-3 text-sm font-semibold text-brand-obsidian">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedVariant.quantity, quantity + 1),
                      )
                    }
                    disabled={quantity >= selectedVariant.quantity}
                    className="flex h-11 w-11 items-center justify-center text-lg text-brand-espresso transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to cart */}
            <div className="mt-8">
              <button
                type="button"
                disabled={!selectedVariant || selectedVariant.quantity <= 0}
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-obsidian px-6 py-4 text-sm font-semibold text-brand-warm-white transition-all duration-200 hover:bg-brand-espresso hover:text-brand-gold-light disabled:cursor-not-allowed disabled:bg-brand-border-dark disabled:text-brand-muted"
              >
                <ShoppingCart className="h-5 w-5" />
                {selectedVariant?.quantity ? "Add to Cart" : "Out of Stock"}
              </button>

              <p className="mt-3 text-center text-xs text-brand-muted">
                Secure checkout · Quality assured
              </p>
            </div>

            {/* Store reassurance */}
            <div className="mt-8 grid grid-cols-3 divide-x divide-brand-border rounded-xl border border-brand-border bg-brand-warm-white py-5">
              <div className="px-3 text-center">
                <p className="text-xs font-semibold text-brand-obsidian">
                  Quality
                </p>
                <p className="mt-1 text-[11px] leading-4 text-brand-muted">
                  Carefully selected
                </p>
              </div>

              <div className="px-3 text-center">
                <p className="text-xs font-semibold text-brand-obsidian">
                  Secure
                </p>
                <p className="mt-1 text-[11px] leading-4 text-brand-muted">
                  Safe checkout
                </p>
              </div>

              <div className="px-3 text-center">
                <p className="text-xs font-semibold text-brand-obsidian">
                  Support
                </p>
                <p className="mt-1 text-[11px] leading-4 text-brand-muted">
                  We&apos;re here to help
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
