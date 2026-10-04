"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { ProductService } from "@/app/services/product.service";
import { ProductVariantService } from "@/app/services/product-variant.service";
import type { ProductVariant } from "@/app/services/product-variant.service";
import { useCartStore } from "@/app/store/cart-store";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  description?: string | null;
  cover_image?: string | null;
  price?: string | number | null;
  is_featured?: boolean;
  is_available?: boolean;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const productId = Number(params.productId);

  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isInvalidProductId = !productId || Number.isNaN(productId);

  /* ============================================================
     LOAD PRODUCT
  ============================================================ */

  useEffect(() => {
    if (isInvalidProductId) {
      return;
    }

    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResponse, variantResponse] = await Promise.all([
          ProductService.getById(productId),
          ProductVariantService.getByProduct(productId),
        ]);

        if (cancelled) return;

        setProduct(productResponse);
        setVariants(variantResponse);

        const defaultVariant =
          variantResponse.find(
            (variant) => variant.is_default && variant.is_available,
          ) ??
          variantResponse.find((variant) => variant.is_available) ??
          variantResponse[0];

        if (defaultVariant) {
          setSelectedVariantId(defaultVariant.id);
        }
      } catch (err) {
        console.error("Failed to load product:", err);

        if (!cancelled) {
          setError("Unable to load this product.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId, isInvalidProductId]);

  /* ============================================================
     SELECTED VARIANT
  ============================================================ */

  const selectedVariant = useMemo(() => {
    return variants.find((variant) => variant.id === selectedVariantId);
  }, [variants, selectedVariantId]);

  /* ============================================================
     PRICE
  ============================================================ */

  const currentPrice = selectedVariant?.price ?? product?.price ?? 0;

  const formattedPrice = useMemo(() => {
    const numericPrice =
      typeof currentPrice === "string" ? Number(currentPrice) : currentPrice;

    if (Number.isNaN(numericPrice)) {
      return "Price unavailable";
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }, [currentPrice]);

  /* ============================================================
     STOCK
  ============================================================ */

  const stockQuantity = selectedVariant?.quantity ?? 0;

  const isAvailable =
    selectedVariant?.is_available === true && stockQuantity > 0;

  /* ============================================================
     VARIANT ATTRIBUTES
  ============================================================ */

  const hasColors = variants.some((variant) => variant.color);

  const colors = useMemo(() => {
    return Array.from(
      new Set(variants.map((variant) => variant.color).filter(Boolean)),
    ) as string[];
  }, [variants]);

  const sizes = useMemo(() => {
    return Array.from(
      new Set(variants.map((variant) => variant.size).filter(Boolean)),
    ) as string[];
  }, [variants]);

  const materials = useMemo(() => {
    return Array.from(
      new Set(variants.map((variant) => variant.material).filter(Boolean)),
    ) as string[];
  }, [variants]);

  const styles = useMemo(() => {
    return Array.from(
      new Set(variants.map((variant) => variant.style).filter(Boolean)),
    ) as string[];
  }, [variants]);

  const strapTypes = useMemo(() => {
    return Array.from(
      new Set(variants.map((variant) => variant.strap_type).filter(Boolean)),
    ) as string[];
  }, [variants]);

  /* ============================================================
     SELECT VARIANT
  ============================================================ */

  const selectVariantByAttribute = (
    attribute: "color" | "size" | "material" | "style" | "strap_type",
    value: string,
  ) => {
    const candidate = variants.find(
      (variant) => variant[attribute] === value && variant.is_available,
    );

    if (candidate) {
      setSelectedVariantId(candidate.id);
      setQuantity(1);
      setSuccess("");
      setError("");
    }
  };

  /* ============================================================
     QUANTITY
  ============================================================ */

  const increaseQuantity = () => {
    if (!selectedVariant) return;

    setQuantity((current) => Math.min(current + 1, selectedVariant.quantity));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  /* ============================================================
     ADD TO CART
  ============================================================ */

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setError("Please select a product variant.");
      return;
    }

    if (!selectedVariant.is_available) {
      setError("This variant is currently unavailable.");
      return;
    }

    if (selectedVariant.quantity <= 0) {
      setError("This variant is out of stock.");
      return;
    }

    if (quantity > selectedVariant.quantity) {
      setError(
        `Only ${selectedVariant.quantity} item${
          selectedVariant.quantity === 1 ? "" : "s"
        } available.`,
      );
      return;
    }

    try {
      setAdding(true);
      setError("");
      setSuccess("");

      addItem({
        variant_id: selectedVariant.id,
        product_id: productId,
        product_name: product?.name ?? "",
        sku: selectedVariant.sku!,
        price: Number(selectedVariant.price),
        quantity,
        stock: selectedVariant.quantity,
        cover_image: product?.cover_image ?? null,
        color: selectedVariant.color,
        size: selectedVariant.size,
      });

      setSuccess("Added to cart.");
    } catch (err) {
      console.error("Failed to add product to cart:", err);

      setError("Unable to add this product to your cart.");
    } finally {
      setAdding(false);
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-8 h-4 w-24 rounded bg-brand-cream" />

            <div className="grid gap-10 lg:grid-cols-2">
              <div className="aspect-square rounded-2xl bg-brand-cream" />

              <div className="space-y-5">
                <div className="h-8 w-3/4 rounded bg-brand-cream" />
                <div className="h-6 w-1/3 rounded bg-brand-cream" />
                <div className="h-20 rounded bg-brand-cream" />
                <div className="h-12 rounded bg-brand-cream" />
                <div className="h-12 rounded bg-brand-cream" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     ERROR / NOT FOUND
  ============================================================ */

  if (error && !product) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
          <div className="mb-5 h-px w-10 bg-brand-champagne" />

          <h1 className="text-2xl font-semibold text-brand-obsidian">
            Product unavailable
          </h1>

          <p className="mt-2 text-sm text-brand-muted">{error}</p>

          <Button
            className="mt-6 border-brand-obsidian bg-brand-obsidian text-brand-warm-white hover:bg-brand-espresso hover:text-brand-gold-light"
            onClick={() => router.push("/products")}
          >
            Back to shop
          </Button>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ======================================================
            BACK
        ====================================================== */}

        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-obsidian"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ====================================================
              PRODUCT IMAGE
          ==================================================== */}

          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-border bg-brand-cream shadow-sm">
              {product.cover_image ? (
                <Image
                  src={product.cover_image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-brand-muted">
                  No image available
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-obsidian/10 via-transparent to-transparent" />

              {product.is_featured && (
                <span className="absolute left-4 top-4 rounded-full border border-brand-champagne/40 bg-brand-obsidian/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gold-light shadow-sm backdrop-blur-sm">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* ====================================================
              PRODUCT INFORMATION
          ==================================================== */}

          <div className="flex flex-col">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-brand-champagne" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-champagne">
                  Product
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-obsidian sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-5">
                <p className="text-2xl font-semibold tracking-tight text-brand-obsidian">
                  {formattedPrice}
                </p>
              </div>
            </div>

            {/* Description */}

            {product.description && (
              <div className="mt-6 border-t border-brand-border pt-6">
                <p className="text-sm leading-7 text-brand-muted-dark">
                  {product.description}
                </p>
              </div>
            )}

            {/* ==================================================
                VARIANTS
            ================================================== */}

            {variants.length > 0 && (
              <div className="mt-8 space-y-6 border-t border-brand-border pt-6">
                {/* Color */}

                {hasColors && colors.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-semibold text-brand-obsidian">
                        Color
                      </label>

                      {selectedVariant?.color && (
                        <span className="text-sm text-brand-muted">
                          {selectedVariant.color}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => {
                        const active = selectedVariant?.color === color;

                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() =>
                              selectVariantByAttribute("color", color)
                            }
                            className={`rounded-lg border px-4 py-2 text-sm transition-all duration-200 ${
                              active
                                ? "border-brand-obsidian bg-brand-obsidian text-brand-gold-light shadow-sm"
                                : "border-brand-border bg-brand-warm-white text-brand-muted-dark hover:border-brand-champagne hover:text-brand-obsidian"
                            }`}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size */}

                {sizes.length > 0 && (
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-brand-obsidian">
                      Size
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => {
                        const active = selectedVariant?.size === size;

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() =>
                              selectVariantByAttribute("size", size)
                            }
                            className={`min-w-12 rounded-lg border px-4 py-2 text-sm transition-all duration-200 ${
                              active
                                ? "border-brand-obsidian bg-brand-obsidian text-brand-gold-light shadow-sm"
                                : "border-brand-border bg-brand-warm-white text-brand-muted-dark hover:border-brand-champagne hover:text-brand-obsidian"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Material */}

                {materials.length > 0 && (
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-brand-obsidian">
                      Material
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {materials.map((material) => {
                        const active = selectedVariant?.material === material;

                        return (
                          <button
                            key={material}
                            type="button"
                            onClick={() =>
                              selectVariantByAttribute("material", material)
                            }
                            className={`rounded-lg border px-4 py-2 text-sm transition-all duration-200 ${
                              active
                                ? "border-brand-obsidian bg-brand-obsidian text-brand-gold-light shadow-sm"
                                : "border-brand-border bg-brand-warm-white text-brand-muted-dark hover:border-brand-champagne hover:text-brand-obsidian"
                            }`}
                          >
                            {material}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Style */}

                {styles.length > 0 && (
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-brand-obsidian">
                      Style
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {styles.map((style) => {
                        const active = selectedVariant?.style === style;

                        return (
                          <button
                            key={style}
                            type="button"
                            onClick={() =>
                              selectVariantByAttribute("style", style)
                            }
                            className={`rounded-lg border px-4 py-2 text-sm transition-all duration-200 ${
                              active
                                ? "border-brand-obsidian bg-brand-obsidian text-brand-gold-light shadow-sm"
                                : "border-brand-border bg-brand-warm-white text-brand-muted-dark hover:border-brand-champagne hover:text-brand-obsidian"
                            }`}
                          >
                            {style}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Strap type */}

                {strapTypes.length > 0 && (
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-brand-obsidian">
                      Strap type
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {strapTypes.map((strapType) => {
                        const active =
                          selectedVariant?.strap_type === strapType;

                        return (
                          <button
                            key={strapType}
                            type="button"
                            onClick={() =>
                              selectVariantByAttribute("strap_type", strapType)
                            }
                            className={`rounded-lg border px-4 py-2 text-sm transition-all duration-200 ${
                              active
                                ? "border-brand-obsidian bg-brand-obsidian text-brand-gold-light shadow-sm"
                                : "border-brand-border bg-brand-warm-white text-brand-muted-dark hover:border-brand-champagne hover:text-brand-obsidian"
                            }`}
                          >
                            {strapType}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================================================
                SELECTED VARIANT
            ================================================== */}

            {selectedVariant && (
              <div className="mt-6 rounded-xl border border-brand-border bg-brand-cream p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-muted">
                      SKU
                    </p>

                    <p className="mt-1 text-sm font-medium text-brand-obsidian">
                      {selectedVariant.sku}
                    </p>
                  </div>

                  <div className="text-right">
                    {isAvailable ? (
                      <p className="flex items-center gap-1.5 text-sm font-medium text-brand-espresso">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-champagne/20">
                          <Check className="h-3 w-3 text-brand-espresso" />
                        </span>
                        In stock
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-brand-muted">
                        Out of stock
                      </p>
                    )}
                  </div>
                </div>

                {isAvailable && (
                  <p className="mt-2 text-xs text-brand-muted">
                    {stockQuantity} available
                  </p>
                )}
              </div>
            )}

            {/* ==================================================
                QUANTITY
            ================================================== */}

            <div className="mt-6">
              <label className="mb-3 block text-sm font-semibold text-brand-obsidian">
                Quantity
              </label>

              <div className="flex h-11 w-fit items-center overflow-hidden rounded-lg border border-brand-border bg-brand-warm-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="flex h-full w-11 items-center justify-center text-brand-muted-dark transition hover:bg-brand-cream hover:text-brand-obsidian disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="flex w-12 justify-center text-sm font-semibold text-brand-obsidian">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    !selectedVariant || quantity >= selectedVariant.quantity
                  }
                  className="flex h-full w-11 items-center justify-center text-brand-muted-dark transition hover:bg-brand-cream hover:text-brand-obsidian disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ==================================================
                ERROR / SUCCESS
            ================================================== */}

            {error && (
              <div className="mt-5 rounded-lg border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-espresso">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-lg border border-brand-champagne/40 bg-brand-gold-soft/30 px-4 py-3 text-sm font-medium text-brand-espresso">
                {success}
              </div>
            )}

            {/* ==================================================
                CART ACTION
            ================================================== */}

            <div className="mt-6">
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={adding || !selectedVariant || !isAvailable}
                className="h-12 w-full rounded-xl border border-brand-obsidian bg-brand-obsidian text-base font-semibold text-brand-warm-white transition-all hover:bg-brand-espresso hover:text-brand-gold-light disabled:bg-brand-cream disabled:text-brand-muted"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />

                {adding
                  ? "Adding to cart..."
                  : !selectedVariant
                    ? "Select an option"
                    : !isAvailable
                      ? "Out of stock"
                      : "Add to cart"}
              </Button>
            </div>

            {/* ==================================================
                STORE BENEFITS
            ================================================== */}

            <div className="mt-8 grid gap-4 border-t border-brand-border pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream">
                  <Truck className="h-4 w-4 text-brand-champagne" />
                </div>

                <div>
                  <p className="text-sm font-medium text-brand-obsidian">
                    Reliable delivery
                  </p>

                  <p className="text-xs text-brand-muted">
                    Delivered safely to your address.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream">
                  <ShieldCheck className="h-4 w-4 text-brand-champagne" />
                </div>

                <div>
                  <p className="text-sm font-medium text-brand-obsidian">
                    Secure checkout
                  </p>

                  <p className="text-xs text-brand-muted">
                    Your payment information is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
