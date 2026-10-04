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
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <Image
          src={selectedImage}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnail */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setSelectedImage(image)}
          className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 ${
            selectedImage === image ? "border-slate-900" : "border-slate-200"
          }`}
        >
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </button>
      </div>
    </div>
  );
}
