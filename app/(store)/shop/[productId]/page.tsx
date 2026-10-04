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
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />

          <div className="space-y-5">
            <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />

            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />

            <div className="h-24 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>

        <p className="mt-2 text-sm text-slate-500">
          The product may have been removed or is no longer available.
        </p>

        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Shop
        </Link>
      </div>
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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shop
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Product Gallery */}

        <ProductGallery product={product} />

        {/* Product Information */}

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            {product.name}
          </h1>

          <div className="mt-6">
            {selectedVariant && (
              <p className="text-2xl font-bold text-slate-950">
                ₦{Number(selectedVariant.price).toLocaleString()}
              </p>
            )}
          </div>

          {product.description && (
            <p className="mt-6 leading-7 text-slate-600">
              {product.description}
            </p>
          )}

          {/* Variants */}

          {variants.length > 0 && (
            <div className="mt-8">
              <ProductVariantSelector
                variants={variants}
                selectedVariantId={selectedVariant?.id ?? null}
                onChange={handleVariantChange}
              />
            </div>
          )}

          {/* Quantity */}

          {selectedVariant && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-slate-900">
                Quantity
              </p>

              <div className="flex w-fit items-center rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-lg"
                >
                  −
                </button>

                <span className="min-w-10 text-center text-sm">{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.min(selectedVariant.quantity, quantity + 1),
                    )
                  }
                  className="px-4 py-2 text-lg"
                >
                  +
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {selectedVariant.quantity} available
              </p>
            </div>
          )}

          {/* Add to Cart */}

          <button
            type="button"
            disabled={!selectedVariant || selectedVariant.quantity <= 0}
            onClick={handleAddToCart}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
