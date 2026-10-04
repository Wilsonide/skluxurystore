/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Package,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { ProductService } from "@/app/services/product.service";
import {
  ProductVariantService,
  type ProductVariant,
  type ProductVariantCreate,
  type ProductVariantUpdate,
} from "@/app/services/product-variant.service";

import { useCategories } from "@/app/hooks/use-categories";
import { useBrands } from "@/app/hooks/use-brands";

import type { Product } from "@/app/types/product";

/* ================================================================
   CLOUDINARY
================================================================ */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/* ================================================================
   TYPES
================================================================ */

interface ProductForm {
  name: string;
  description: string;
  category_id: number | "";
  brand_id: number | "";
  gender: string;
  warranty: string;
  cover_image: string;
  cover_public_id: string;
  is_available: boolean;
  is_featured: boolean;
}

interface VariantForm {
  price: string;
  quantity: string;
  color: string;
  size: string;
  material: string;
  strap_type: string;
  is_default: boolean;
  is_available: boolean;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

const emptyVariant: VariantForm = {
  price: "",
  quantity: "0",
  color: "",
  size: "",
  material: "",
  strap_type: "",
  is_default: false,
  is_available: true,
};

/* ================================================================
   PAGE
================================================================ */

export default function AdminProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const productId = Number(params.productId);

  const { categories, loading: categoriesLoading } = useCategories();

  const { brands, loading: brandsLoading } = useBrands();

  /* ================================================================
     PRODUCT
  ================================================================= */

  const [product, setProduct] = useState<Product | null>(null);

  const [variants, setVariants] = useState<ProductVariant[]>([]);

  /* ================================================================
     LOADING
  ================================================================= */

  const [loading, setLoading] = useState(true);

  const [savingProduct, setSavingProduct] = useState(false);

  const [savingVariant, setSavingVariant] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [deletingVariantId, setDeletingVariantId] = useState<number | null>(
    null,
  );

  /* ================================================================
     ALERTS
  ================================================================= */

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  /* ================================================================
     PRODUCT FORM
  ================================================================= */

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    category_id: "",
    brand_id: "",
    gender: "",
    warranty: "",
    cover_image: "",
    cover_public_id: "",
    is_available: true,
    is_featured: false,
  });

  /* ================================================================
     VARIANT FORM
  ================================================================= */

  const [showVariantForm, setShowVariantForm] = useState(false);

  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);

  const [variantForm, setVariantForm] = useState<VariantForm>(emptyVariant);

  /* ================================================================
     PRODUCT ID VALIDATION
  ================================================================= */

  const hasInvalidProductId = !productId || Number.isNaN(productId);

  /* ================================================================
     LOAD PRODUCT
  ================================================================= */

  useEffect(() => {
    if (hasInvalidProductId) {
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);

        setError(null);

        const [productResult, variantsResult] = await Promise.all([
          ProductService.getById(productId),
          ProductVariantService.getByProduct(productId),
        ]);

        setProduct(productResult);

        setVariants(variantsResult);

        setForm({
          name: productResult.name ?? "",

          description: productResult.description ?? "",

          category_id: productResult.category_id ?? "",

          brand_id: productResult.brand_id ?? "",

          gender: productResult.gender ?? "",

          warranty: productResult.warranty ?? "",

          cover_image: productResult.cover_image ?? "",

          cover_public_id: productResult.cover_public_id ?? "",

          is_available: productResult.is_available ?? true,

          is_featured: productResult.is_featured ?? false,
        });
      } catch (err: any) {
        setError(err?.response?.data?.detail ?? "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [productId, hasInvalidProductId]);

  /* ================================================================
     UPDATE PRODUCT FORM
  ================================================================= */

  const updateForm = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* ================================================================
     CLOUDINARY UPLOAD
  ================================================================= */

  const uploadImageToCloudinary = async (
    file: File,
  ): Promise<CloudinaryUploadResponse> => {
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

    return await response.json();
  };

  /* ================================================================
     IMAGE CHANGE
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

      setSuccess(null);

      setUploadingImage(true);

      const uploadedImage = await uploadImageToCloudinary(file);

      updateForm("cover_image", uploadedImage.secure_url);

      updateForm("cover_public_id", uploadedImage.public_id);

      setSuccess("Image uploaded. Save the product to apply the change.");
    } catch (err: any) {
      setError(err?.message ?? "Failed to upload product image.");
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
    updateForm("cover_image", "");

    updateForm("cover_public_id", "");

    setSuccess("Image removed. Save the product to apply the change.");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ================================================================
     UPDATE PRODUCT
  ================================================================= */

  const handleProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    setSuccess(null);

    if (!form.name.trim()) {
      setError("Product name is required.");

      return;
    }

    if (!form.description.trim()) {
      setError("Product description is required.");

      return;
    }

    if (!form.category_id) {
      setError("Please select a category.");

      return;
    }

    if (!form.cover_image) {
      setError("Please upload a product image.");

      return;
    }

    try {
      setSavingProduct(true);

      const updated = await ProductService.update(productId, {
        name: form.name.trim(),

        description: form.description.trim(),

        category_id: Number(form.category_id),

        brand_id: form.brand_id === "" ? null : Number(form.brand_id),

        gender: form.gender.trim() || null,

        warranty: form.warranty.trim() || null,

        cover_image: form.cover_image || null,

        cover_public_id: form.cover_public_id || null,

        is_available: form.is_available,

        is_featured: form.is_featured,
      });

      setProduct(updated);

      setSuccess("Product updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ??
          err?.message ??
          "Failed to update product.",
      );
    } finally {
      setSavingProduct(false);
      router.push("/admin/products");
    }
  };

  /* ================================================================
     VARIANT FORM
  ================================================================= */

  const updateVariantForm = <K extends keyof VariantForm>(
    key: K,
    value: VariantForm[K],
  ) => {
    setVariantForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* ================================================================
     RESET VARIANT FORM
  ================================================================= */

  const resetVariantForm = () => {
    setVariantForm({
      ...emptyVariant,
    });

    setEditingVariantId(null);

    setShowVariantForm(false);
  };

  /* ================================================================
     ADD VARIANT
  ================================================================= */

  const startAddVariant = () => {
    setError(null);

    setSuccess(null);

    setVariantForm({
      ...emptyVariant,
    });

    setEditingVariantId(null);

    setShowVariantForm(true);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  /* ================================================================
     EDIT VARIANT
  ================================================================= */

  const startEditVariant = (variant: ProductVariant) => {
    setError(null);

    setSuccess(null);

    setEditingVariantId(variant.id);

    setVariantForm({
      price: String(variant.price),

      quantity: String(variant.quantity),

      color: variant.color ?? "",

      size: variant.size ?? "",

      material: variant.material ?? "",

      strap_type: variant.strap_type ?? "",

      is_default: variant.is_default,

      is_available: variant.is_available,
    });

    setShowVariantForm(true);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  /* ================================================================
     SUBMIT VARIANT
  ================================================================= */

  const handleVariantSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    setSuccess(null);

    const price = Number(variantForm.price);

    const quantity = Number(variantForm.quantity);

    if (Number.isNaN(price) || price <= 0) {
      setError("Enter a valid variant price greater than zero.");

      return;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be a valid non-negative number.");

      return;
    }

    try {
      setSavingVariant(true);

      if (editingVariantId) {
        const payload: ProductVariantUpdate = {
          price,

          quantity,

          color: variantForm.color.trim() || null,

          size: variantForm.size.trim() || null,

          material: variantForm.material.trim() || null,

          strap_type: variantForm.strap_type.trim() || null,

          is_default: variantForm.is_default,

          is_available: variantForm.is_available,
        };

        const updated = await ProductVariantService.update(
          editingVariantId,
          payload,
        );

        setVariants((current) =>
          current.map((variant) =>
            variant.id === editingVariantId ? updated : variant,
          ),
        );

        setSuccess("Variant updated successfully.");
      } else {
        const payload: ProductVariantCreate = {
          price,

          quantity,

          color: variantForm.color.trim() || null,

          size: variantForm.size.trim() || null,

          material: variantForm.material.trim() || null,

          strap_type: variantForm.strap_type.trim() || null,

          is_default: variantForm.is_default,

          is_available: variantForm.is_available,
        };

        const created = await ProductVariantService.create(productId, payload);

        setVariants((current) => [...current, created]);

        setSuccess("Variant created successfully.");
      }

      resetVariantForm();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ??
          err?.message ??
          "Failed to save variant.",
      );
    } finally {
      setSavingVariant(false);
    }
  };

  /* ================================================================
     DELETE VARIANT
  ================================================================= */

  const handleDeleteVariant = async (variantId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this variant?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingVariantId(variantId);

      setError(null);

      setSuccess(null);

      await ProductVariantService.delete(variantId);

      setVariants((current) =>
        current.filter((variant) => variant.id !== variantId),
      );

      if (editingVariantId === variantId) {
        resetVariantForm();
      }

      setSuccess("Variant deleted successfully.");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ??
          err?.message ??
          "Failed to delete variant.",
      );
    } finally {
      setDeletingVariantId(null);
    }
  };

  /* ================================================================
     LOADING
  ================================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />

            <div className="h-40 animate-pulse rounded-xl bg-slate-200" />

            <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  /* ================================================================
     NOT FOUND
  ================================================================= */

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-950">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The product could not be loaded.
          </p>

          <Link
            href="/admin/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  /* ================================================================
     RENDER
  ================================================================= */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ==========================================================
            HEADER
        ========================================================== */}

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
                Edit Product
              </h1>

              <p className="text-sm text-slate-500">
                Update product information and configure its variants.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================================
            ALERTS
        ========================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* ========================================================
              BASIC INFORMATION
          ======================================================== */}

          <form
            onSubmit={handleProductSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="font-semibold text-slate-950">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                General information about this product.
              </p>
            </div>

            <div className="grid gap-5">
              {/* Product Name */}

              <Field label="Product Name" required>
                <input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="e.g. Classic Leather Watch"
                  className={inputClass}
                />
              </Field>

              {/* Description */}

              <Field label="Description" required>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  rows={5}
                  placeholder="Describe the product..."
                  className={inputClass}
                />
              </Field>

              {/* Category / Brand */}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Category" required>
                  <select
                    value={form.category_id}
                    onChange={(event) =>
                      updateForm(
                        "category_id",
                        event.target.value ? Number(event.target.value) : "",
                      )
                    }
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
                    value={form.brand_id}
                    onChange={(event) =>
                      updateForm(
                        "brand_id",
                        event.target.value ? Number(event.target.value) : "",
                      )
                    }
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

            {/* ======================================================
                PRODUCT IMAGE
            ====================================================== */}

            <div className="mt-8 border-t border-slate-100 pt-8">
              <div className="mb-6">
                <h2 className="font-semibold text-slate-950">
                  Product Image
                  <span className="ml-1 text-red-500">*</span>
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload the main image customers will see for this product.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {form.cover_image ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200">
                  <div className="relative aspect-[16/9] w-full bg-slate-100 sm:aspect-[2/1]">
                    <Image
                      src={form.cover_image}
                      alt={form.name || "Product preview"}
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

                      <p className="mt-1 text-xs text-slate-500">
                        Replace the image or remove it.
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        {uploadingImage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
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
            </div>

            {/* ======================================================
                PRODUCT DETAILS
            ====================================================== */}

            <div className="mt-8 border-t border-slate-100 pt-8">
              <div className="mb-6">
                <h2 className="font-semibold text-slate-950">
                  Product Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Optional information about the product.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Gender">
                  <input
                    value={form.gender}
                    onChange={(event) =>
                      updateForm("gender", event.target.value)
                    }
                    placeholder="e.g. Men, Women, Unisex"
                    className={inputClass}
                  />
                </Field>

                <Field label="Warranty">
                  <input
                    value={form.warranty}
                    onChange={(event) =>
                      updateForm("warranty", event.target.value)
                    }
                    placeholder="e.g. 1 year"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            {/* ======================================================
                VISIBILITY
            ====================================================== */}

            <div className="mt-8 border-t border-slate-100 pt-8">
              <div className="mb-5">
                <h2 className="font-semibold text-slate-950">Visibility</h2>
              </div>

              <div className="space-y-4">
                <Checkbox
                  checked={form.is_available}
                  onChange={(value) => updateForm("is_available", value)}
                  label="Product is available"
                  description="Customers can purchase this product."
                />

                <Checkbox
                  checked={form.is_featured}
                  onChange={(value) => updateForm("is_featured", value)}
                  label="Featured product"
                  description="Show this product in featured product sections."
                />
              </div>
            </div>

            {/* ======================================================
                SAVE PRODUCT
            ====================================================== */}

            <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={savingProduct || uploadingImage}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingProduct ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Product...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ========================================================
              VARIANTS
          ======================================================== */}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-950">
                  Product Variants
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage different prices, stock, colors and configurations.
                </p>
              </div>

              {!showVariantForm && (
                <button
                  type="button"
                  onClick={startAddVariant}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Variant
                </button>
              )}
            </div>

            {/* ======================================================
                VARIANT LIST
            ====================================================== */}

            <div className="space-y-5">
              {variants.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No variants yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the first variant for this product.
                  </p>
                </div>
              ) : (
                variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
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

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditVariant(variant)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingVariantId === variant.id}
                          onClick={() => handleDeleteVariant(variant.id)}
                          className="rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          title="Delete variant"
                        >
                          {deletingVariantId === variant.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <VariantValue
                        label="Price"
                        value={`₦${Number(variant.price).toLocaleString()}`}
                      />

                      <VariantValue
                        label="Quantity"
                        value={String(variant.quantity)}
                      />

                      {variant.color && (
                        <VariantValue label="Color" value={variant.color} />
                      )}

                      {variant.size && (
                        <VariantValue label="Size" value={variant.size} />
                      )}

                      {variant.material && (
                        <VariantValue
                          label="Material"
                          value={variant.material}
                        />
                      )}

                      {variant.strap_type && (
                        <VariantValue
                          label="Strap Type"
                          value={variant.strap_type}
                        />
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          variant.is_available && variant.quantity > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {variant.is_available && variant.quantity > 0
                          ? "Available"
                          : "Unavailable"}
                      </span>

                      {variant.is_default && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ======================================================
                VARIANT FORM
            ====================================================== */}

            {showVariantForm && (
              <form
                onSubmit={handleVariantSubmit}
                className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {editingVariantId ? "Edit Variant" : "Add Variant"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Configure price, stock and product options.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetVariantForm}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Price" required>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variantForm.price}
                      onChange={(event) =>
                        updateVariantForm("price", event.target.value)
                      }
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Quantity" required>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={variantForm.quantity}
                      onChange={(event) =>
                        updateVariantForm("quantity", event.target.value)
                      }
                      placeholder="0"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Color">
                    <input
                      value={variantForm.color}
                      onChange={(event) =>
                        updateVariantForm("color", event.target.value)
                      }
                      placeholder="Gold"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Size">
                    <input
                      value={variantForm.size}
                      onChange={(event) =>
                        updateVariantForm("size", event.target.value)
                      }
                      placeholder="Large"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Material">
                    <input
                      value={variantForm.material}
                      onChange={(event) =>
                        updateVariantForm("material", event.target.value)
                      }
                      placeholder="Stainless Steel"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Strap Type">
                    <input
                      value={variantForm.strap_type}
                      onChange={(event) =>
                        updateVariantForm("strap_type", event.target.value)
                      }
                      placeholder="Leather"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mt-5 flex flex-wrap gap-5">
                  <Checkbox
                    checked={variantForm.is_available}
                    onChange={(value) =>
                      updateVariantForm("is_available", value)
                    }
                    label="Available"
                    description="Customers can purchase this variant."
                  />

                  <Checkbox
                    checked={variantForm.is_default}
                    onChange={(value) => updateVariantForm("is_default", value)}
                    label="Default variant"
                    description="Use this variant when the product is first opened."
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetVariantForm}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingVariant}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingVariant && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    {savingVariant
                      ? "Saving..."
                      : editingVariantId
                        ? "Update Variant"
                        : "Create Variant"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
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
   VARIANT VALUE
================================================================ */

function VariantValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

/* ================================================================
   INPUT STYLE
================================================================ */

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100";
