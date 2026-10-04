"use client";

import Image from "next/image";
import { useState } from "react";

import type { Product } from "@/app/types/product";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const image = product.cover_image || "/images/product-placeholder.png";

  const [selectedImage, setSelectedImage] = useState(image);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="group relative aspect-square overflow-hidden rounded-2xl border border-brand-border bg-brand-cream">
        <Image
          src={selectedImage}
          alt={product.name}
          fill
          priority
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Subtle luxury overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-obsidian/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Thumbnail */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setSelectedImage(image)}
          aria-label={`View ${product.name}`}
          className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-brand-cream transition-all duration-200 ${
            selectedImage === image
              ? "border-brand-champagne shadow-[0_0_0_2px_rgba(201,169,110,0.12)]"
              : "border-brand-border opacity-75 hover:border-brand-border-dark hover:opacity-100"
          }`}
        >
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="80px"
          />
        </button>
      </div>
    </div>
  );
}
