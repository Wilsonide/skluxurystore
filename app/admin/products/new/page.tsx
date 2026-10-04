/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Package,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { ProductService } from "@/app/services/product.service";
import { useCategories } from "@/app/hooks/use-categories";
import { useBrands } from "@/app/hooks/use-brands";

import type {
  ProductCreate,
  ProductVariantCreate,
} from "@/app/services/product.service";

/* ================================================================
   CLOUDINARY CONFIGURATION
================================================================ */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/* ================================================================
   TYPES
================================================================ */

interface VariantForm extends ProductVariantCreate {
  localId: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

/* ================================================================
   CREATE VARIANT
================================================================ */

function createVariant(): VariantForm {
  return {
    localId: crypto.randomUUID(),

    price: 0,
    quantity: 0,

    color: "",
    size: "",
    material: "",

    is_default: false,
  };
}

/* ================================================================
   PAGE
================================================================ */

export default function NewProductPage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { categories, loading: categoriesLoading } = useCategories();

  const { brands, loading: brandsLoading } = useBrands();

  /* ================================================================
     PRODUCT INFORMATION
  ================================================================= */

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [brandId, setBrandId] = useState("");

  /* ================================================================
     CLOUDINARY IMAGE
  ================================================================= */

  const [coverImage, setCoverImage] = useState("");

  const [coverPublicId, setCoverPublicId] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);

  /* ================================================================
     PRODUCT STATUS
  ================================================================= */

  const [isAvailable, setIsAvailable] = useState(true);

  const [isFeatured, setIsFeatured] = useState(false);

  /* ================================================================
     VARIANTS
  ================================================================= */

  const [variants, setVariants] = useState<VariantForm[]>([createVariant()]);

  /* ================================================================
     FORM STATE
  ================================================================= */

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ================================================================
     CLOUDINARY UPLOAD
  ================================================================= */

  const uploadImageToCloudinary = async (file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary configuration is missing. Check your environment variables.",
      );
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file.");
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      throw new Error("Image size must not exceed 5MB.");
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    formData.append("folder", "store/products");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const data = await response.json();

      throw new Error(
        data?.error?.message ?? "Failed to upload image to Cloudinary.",
      );
    }

    const data: CloudinaryUploadResponse = await response.json();

    return data;
  };

  /* ================================================================
     HANDLE IMAGE SELECTION
  ================================================================= */

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setError(null);

      setUploadingImage(true);

      const uploadedImage = await uploadImageToCloudinary(file);

      setCoverImage(uploadedImage.secure_url);

      setCoverPublicId(uploadedImage.public_id);
    } catch (error: any) {
      setError(error?.message ?? "Failed to upload product image.");
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* ================================================================
     REMOVE IMAGE
  ================================================================= */

  const removeImage = () => {
    setCoverImage("");

    setCoverPublicId("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ================================================================
     VARIANTS
  ================================================================= */

  const addVariant = () => {
    setVariants((current) => [...current, createVariant()]);
  };

  const removeVariant = (localId: string) => {
    setVariants((current) =>
      current.filter((variant) => variant.localId !== localId),
    );
  };

  const updateVariant = (
    localId: string,
    field: keyof ProductVariantCreate,
    value: string | number | boolean,
  ) => {
    setVariants((current) =>
      current.map((variant) =>
        variant.localId === localId
          ? {
              ...variant,
              [field]: value,
            }
          : variant,
      ),
    );
  };

  const setDefaultVariant = (localId: string) => {
    setVariants((current) =>
      current.map((variant) => ({
        ...variant,
        is_default: variant.localId === localId,
      })),
    );
  };

  /* ================================================================
     FORM VALIDATION
  ================================================================= */

  const hasValidVariants =
    variants.length > 0 &&
    variants.every(
      (variant) => Number(variant.price) > 0 && Number(variant.quantity) >= 0,
    );

  const isFormValid =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    categoryId.length > 0 &&
    coverImage.length > 0 &&
    !uploadingImage &&
    hasValidVariants;

  /* ================================================================
     SUBMIT
  ================================================================= */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!isFormValid) {
      setError(
        "Please complete all required fields before creating the product.",
      );

      return;
    }

    try {
      setSaving(true);

      const payload: ProductCreate = {
        name: name.trim(),

        description: description.trim(),

        category_id: Number(categoryId),

        brand_id: brandId ? Number(brandId) : null,

        cover_image: coverImage || null,

        cover_public_id: coverPublicId || null,

        is_available: isAvailable,

        is_featured: isFeatured,

        variants: variants.map((variant) => ({
          price: Number(variant.price),

          quantity: Number(variant.quantity),

          color: variant.color?.trim() || null,

          size: variant.size?.trim() || null,

          material: variant.material?.trim() || null,

          is_default: variant.is_default ?? false,
        })),
      };

      await ProductService.create(payload);

      router.push(`/admin/products`);
    } catch (error: any) {
      setError(
        error?.response?.data?.detail ??
          error?.message ??
          "Failed to create product.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================================================================
     UI
  ================================================================= */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8">
          <Link
            href="/admin/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Add Product
              </h1>

              <p className="text-sm text-slate-500">
                Create a product and configure its variants.
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFORMATION */}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="font-semibold text-slate-950">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                General information about this product.
              </p>
            </div>

            <div className="grid gap-5">
              <Field label="Product Name" required>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Classic Leather Watch"
                  className={inputClass}
                />
              </Field>

              <Field label="Description" required>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                  placeholder="Describe the product..."
                  className={inputClass}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Category" required>
                  <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    disabled={categoriesLoading}
                    className={inputClass}
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select category"}
                    </option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Brand">
                  <select
                    value={brandId}
                    onChange={(event) => setBrandId(event.target.value)}
                    disabled={brandsLoading}
                    className={inputClass}
                  >
                    <option value="">
                      {brandsLoading ? "Loading brands..." : "No brand"}
                    </option>

                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </section>

          {/* PRODUCT IMAGE */}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="font-semibold text-slate-950">
                Product Image
                <span className="ml-1 text-red-500">*</span>
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload the main image customers will see.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            {coverImage ? (
              <div className="relative overflow-hidden rounded-xl border border-slate-200">
                <div className="relative aspect-[16/9] w-full bg-slate-100 sm:aspect-[2/1]">
                  <Image
                    src={coverImage}
                    alt="Product preview"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 border-t bg-white p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      Product image uploaded
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {coverPublicId}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4" />
                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={uploadingImage}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex min-h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />

                    <p className="mt-4 text-sm font-medium text-slate-700">
                      Uploading image...
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Please wait while your image is uploaded.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <ImageIcon className="h-6 w-6 text-slate-500" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-800">
                      Upload product image
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PNG, JPG, JPEG or WEBP up to 5MB
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </span>
                  </>
                )}
              </button>
            )}
          </section>

          {/* VISIBILITY */}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold text-slate-950">Visibility</h2>

              <p className="mt-1 text-sm text-slate-500">
                Control how this product appears in your store.
              </p>
            </div>

            <div className="space-y-4">
              <Checkbox
                checked={isAvailable}
                onChange={setIsAvailable}
                label="Product is available"
                description="Customers can purchase this product."
              />

              <Checkbox
                checked={isFeatured}
                onChange={setIsFeatured}
                label="Featured product"
                description="Show this product in featured sections."
              />
            </div>
          </section>

          {/* VARIANTS */}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-950">
                  Product Variants
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add different prices, quantities, colors, sizes, or materials.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-5">
              {variants.map((variant, index) => (
                <div
                  key={variant.localId}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  {/* VARIANT HEADER */}

                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        Variant {index + 1}
                      </p>

                      {variant.is_default && (
                        <p className="mt-1 text-xs font-medium text-blue-600">
                          Default variant
                        </p>
                      )}
                    </div>

                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.localId)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Remove variant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* VARIANT FIELDS */}

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Price" required>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price || ""}
                        onChange={(event) =>
                          updateVariant(
                            variant.localId,
                            "price",
                            Number(event.target.value),
                          )
                        }
                        placeholder="0.00"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Quantity" required>
                      <input
                        type="number"
                        min="0"
                        value={variant.quantity}
                        onChange={(event) =>
                          updateVariant(
                            variant.localId,
                            "quantity",
                            Number(event.target.value),
                          )
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Color">
                      <input
                        value={variant.color ?? ""}
                        onChange={(event) =>
                          updateVariant(
                            variant.localId,
                            "color",
                            event.target.value,
                          )
                        }
                        placeholder="Gold"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Size">
                      <input
                        value={variant.size ?? ""}
                        onChange={(event) =>
                          updateVariant(
                            variant.localId,
                            "size",
                            event.target.value,
                          )
                        }
                        placeholder="Large"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Material">
                      <input
                        value={variant.material ?? ""}
                        onChange={(event) =>
                          updateVariant(
                            variant.localId,
                            "material",
                            event.target.value,
                          )
                        }
                        placeholder="Stainless Steel"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  {/* DEFAULT VARIANT */}

                  <div className="mt-5">
                    <Checkbox
                      checked={variant.is_default ?? false}
                      onChange={() => setDefaultVariant(variant.localId)}
                      label="Default variant"
                      description="Use this variant when customers first view the product."
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            {isFormValid && (
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  "Create Product"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

/* ================================================================
   FIELD
================================================================ */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-800">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

/* ================================================================
   CHECKBOX
================================================================ */

function Checkbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300"
      />

      <span>
        <span className="block text-sm font-medium text-slate-800">
          {label}
        </span>

        <span className="block text-xs text-slate-500">{description}</span>
      </span>
    </label>
  );
}

/* ================================================================
   INPUT STYLE
================================================================ */

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100";
