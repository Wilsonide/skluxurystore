"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { ProductService } from "@/app/services/product.service";
import { ProductVariantService } from "@/app/services/product-variant.service";
import type { ProductVariant } from "@/app/services/product-variant.service";
import type { Product } from "@/app/types/product";
import { useCartStore } from "@/app/store/cart-store";
import { Button } from "@/components/ui/button";

/* ============================================================
   BACKEND-ALIGNED TYPES
============================================================ */

interface ProductImage {
  id: number;
  image_url: string;
  public_id: string | null;
  product_id: number;
  sort_order: number;
  is_cover: boolean;
}

type ProductDetails = Product & {
  images?: ProductImage[];
};

/* ============================================================
   PAGE
============================================================ */

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const rawProductId = params.productId;
  const productId = Number(
    Array.isArray(rawProductId) ? rawProductId[0] : rawProductId,
  );

  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isInvalidProductId = !Number.isInteger(productId) || productId <= 0;

  /* ============================================================
     LOAD PRODUCT AND VARIANTS
  ============================================================ */

  useEffect(() => {
    if (isInvalidProductId) {
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const [productResponse, variantResponse] = await Promise.all([
          ProductService.getById(productId),
          ProductVariantService.getByProduct(productId),
        ]);

        if (cancelled) return;

        const productData = productResponse as ProductDetails;

        setProduct(productData);
        setVariants(variantResponse);

        // Prefer the image marked as the cover, then the first
        // gallery image ordered by sort_order.
        const sortedImages = [...(productData.images ?? [])].sort(
          (a, b) => a.sort_order - b.sort_order,
        );

        const coverIndex = sortedImages.findIndex((image) => image.is_cover);

        setActiveImageIndex(coverIndex >= 0 ? coverIndex : 0);

        const defaultVariant =
          variantResponse.find(
            (variant) =>
              variant.is_default &&
              variant.is_available &&
              variant.quantity > 0,
          ) ??
          variantResponse.find(
            (variant) => variant.is_available && variant.quantity > 0,
          ) ??
          variantResponse.find((variant) => variant.is_available) ??
          variantResponse[0];

        setSelectedVariantId(defaultVariant?.id ?? null);
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
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId, isInvalidProductId]);

  /* ============================================================
     PRODUCT GALLERY

     The backend returns ProductImageResponse[] in product.images.
     The legacy cover_image is retained as a fallback.
  ============================================================ */

  const galleryImages = useMemo(() => {
    if (!product) return [];

    const images = [...(product.images ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    );

    // Avoid adding the same cover image twice.
    const uniqueImages = images.filter(
      (image, index, all) =>
        all.findIndex(
          (candidate) => candidate.image_url === image.image_url,
        ) === index,
    );

    if (uniqueImages.length > 0) {
      return uniqueImages;
    }

    if (product.cover_image) {
      return [
        {
          id: -1,
          image_url: product.cover_image,
          public_id: product.cover_public_id ?? null,
          product_id: product.id,
          sort_order: 0,
          is_cover: true,
        },
      ];
    }

    return [];
  }, [product]);

  // Keep the selected index valid if the gallery changes.
  const safeImageIndex =
    galleryImages.length > 0
      ? Math.min(activeImageIndex, galleryImages.length - 1)
      : 0;

  const activeImage = galleryImages[safeImageIndex];

  const showPreviousImage = () => {
    if (galleryImages.length <= 1) return;

    setActiveImageIndex((current) =>
      current <= 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const showNextImage = () => {
    if (galleryImages.length <= 1) return;

    setActiveImageIndex((current) =>
      current >= galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  /* ============================================================
     SELECTED VARIANT
  ============================================================ */

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId),
    [variants, selectedVariantId],
  );

  /* ============================================================
     PRICE
  ============================================================ */

  const currentPrice = selectedVariant?.price;

  const formattedPrice = useMemo(() => {
    if (currentPrice === undefined || currentPrice === null) {
      return "Price unavailable";
    }

    const numericPrice = Number(currentPrice);

    if (!Number.isFinite(numericPrice)) {
      return "Price unavailable";
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(numericPrice);
  }, [currentPrice]);

  /* ============================================================
     AVAILABILITY
  ============================================================ */

  const stockQuantity = selectedVariant?.quantity ?? 0;

  const isAvailable =
    product?.is_available === true &&
    selectedVariant?.is_available === true &&
    stockQuantity > 0;

  /* ============================================================
     VARIANT ATTRIBUTES

     These are the fields in the supplied backend response schema.
  ============================================================ */

  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.color)
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [variants],
  );

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.size)
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [variants],
  );

  const materials = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.material)
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [variants],
  );

  /* ============================================================
     VARIANT SELECTION

     Only switch to a variant matching the selected attribute
     and all previously selected attributes.
  ============================================================ */

  const selectVariantByAttribute = (
    attribute: "color" | "size" | "material",
    value: string,
  ) => {
    const otherAttributes = (["color", "size", "material"] as const).filter(
      (key) => key !== attribute,
    );

    const candidate = variants.find((variant) => {
      if (variant[attribute] !== value) return false;

      return otherAttributes.every((key) => {
        const currentValue = selectedVariant?.[key];

        return !currentValue || variant[key] === currentValue;
      });
    });

    if (!candidate) {
      setError("That combination is not available.");
      return;
    }

    setSelectedVariantId(candidate.id);
    setQuantity(1);
    setSuccess("");
    setError("");
  };

  /* ============================================================
     QUANTITY
  ============================================================ */

  const increaseQuantity = () => {
    if (!selectedVariant || !isAvailable) return;

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

    if (!product?.is_available || !selectedVariant.is_available) {
      setError("This product variant is currently unavailable.");
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
        product_id: product.id,
        product_name: product.name,
        sku: selectedVariant.sku || `VAR-${selectedVariant.id}`,
        price: Number(selectedVariant.price),
        quantity,
        stock: selectedVariant.quantity,
        cover_image: activeImage?.image_url ?? product.cover_image ?? null,
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

  if ((error || isInvalidProductId) && !product) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
          <div className="mb-5 h-px w-10 bg-brand-champagne" />

          <h1 className="text-2xl font-semibold text-brand-obsidian">
            Product unavailable
          </h1>

          <p className="mt-2 text-sm text-brand-muted">
            {isInvalidProductId ? "Invalid product ID." : error}
          </p>

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

  if (!product) return null;

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* BACK */}

        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-obsidian"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ==================================================
              PRODUCT GALLERY
          ================================================== */}

          <section className="min-w-0">
            <div className="group relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-border bg-brand-cream shadow-sm">
                {activeImage ? (
                  <Image
                    key={activeImage.image_url}
                    src={activeImage.image_url}
                    alt={`${product.name} - image ${safeImageIndex + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02] sm:p-6"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-brand-muted">
                    <ImageIcon className="h-12 w-12" />
                    <p className="text-sm">No product images available</p>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-obsidian/10 via-transparent to-transparent" />

                {product.is_featured && (
                  <span className="absolute left-4 top-4 rounded-full border border-brand-champagne/40 bg-brand-obsidian/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gold-light shadow-sm backdrop-blur-sm">
                    Featured
                  </span>
                )}

                {/* PREVIOUS */}

                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPreviousImage}
                      aria-label="Previous product image"
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-brand-obsidian shadow-md transition hover:bg-white sm:left-5 sm:h-11 sm:w-11"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* NEXT */}

                    <button
                      type="button"
                      onClick={showNextImage}
                      aria-label="Next product image"
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-brand-obsidian shadow-md transition hover:bg-white sm:right-5 sm:h-11 sm:w-11"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* IMAGE COUNTER */}

                    <div className="absolute bottom-4 right-4 rounded-full border border-white/30 bg-brand-obsidian/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                      {safeImageIndex + 1} / {galleryImages.length}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* THUMBNAILS */}

            {galleryImages.length > 1 && (
              <div
                className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5"
                aria-label="Product image thumbnails"
              >
                {galleryImages.map((image, index) => {
                  const active = index === safeImageIndex;

                  return (
                    <button
                      key={`${image.id}-${image.image_url}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={active}
                      className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-brand-cream transition-all duration-200 ${
                        active
                          ? "border-brand-obsidian ring-2 ring-brand-champagne/40"
                          : "border-brand-border opacity-75 hover:border-brand-champagne hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image.image_url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 22vw, 120px"
                        className="object-contain p-1.5"
                      />

                      {active && (
                        <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-obsidian text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {galleryImages.length > 1 && (
              <p className="mt-3 text-center text-xs text-brand-muted">
                Select a thumbnail or use the arrows to explore the gallery.
              </p>
            )}
          </section>

          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <section className="flex min-w-0 flex-col">
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

            {/* DESCRIPTION */}

            {product.description && (
              <div className="mt-6 border-t border-brand-border pt-6">
                <p className="whitespace-pre-line text-sm leading-7 text-brand-muted-dark">
                  {product.description}
                </p>
              </div>
            )}

            {/* VARIANTS */}

            {variants.length > 0 && (
              <div className="mt-8 space-y-6 border-t border-brand-border pt-6">
                {/* COLOR */}

                {colors.length > 0 && (
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
                            aria-pressed={active}
                            className={`rounded-lg border px-4 py-2 text-sm transition-all ${
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

                {/* SIZE */}

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
                            aria-pressed={active}
                            className={`min-w-12 rounded-lg border px-4 py-2 text-sm transition-all ${
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

                {/* MATERIAL */}

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
                            aria-pressed={active}
                            className={`rounded-lg border px-4 py-2 text-sm transition-all ${
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
              </div>
            )}

            {/* SELECTED VARIANT */}

            {selectedVariant && (
              <div className="mt-6 rounded-xl border border-brand-border bg-brand-cream p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-muted">
                      Variant
                    </p>

                    <p className="mt-1 text-sm font-medium text-brand-obsidian">
                      {[
                        selectedVariant.color,
                        selectedVariant.size,
                        selectedVariant.material,
                      ]
                        .filter(Boolean)
                        .join(" / ") || `Variant #${selectedVariant.id}`}
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

            {/* QUANTITY */}

            <div className="mt-6">
              <label className="mb-3 block text-sm font-semibold text-brand-obsidian">
                Quantity
              </label>

              <div className="flex h-11 w-fit items-center overflow-hidden rounded-lg border border-brand-border bg-brand-warm-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
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
                    !selectedVariant ||
                    !isAvailable ||
                    quantity >= stockQuantity
                  }
                  aria-label="Increase quantity"
                  className="flex h-full w-11 items-center justify-center text-brand-muted-dark transition hover:bg-brand-cream hover:text-brand-obsidian disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ERROR / SUCCESS */}

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mt-5 rounded-lg border border-brand-champagne/40 bg-brand-gold-soft/30 px-4 py-3 text-sm font-medium text-brand-espresso"
              >
                {success}
              </div>
            )}

            {/* CART ACTION */}

            <div className="mt-6">
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  adding ||
                  !selectedVariant ||
                  !isAvailable ||
                  quantity > stockQuantity
                }
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

            {/* STORE BENEFITS */}

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
          </section>
        </div>
      </div>
    </main>
  );
}
