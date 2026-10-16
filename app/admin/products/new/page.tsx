"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Package,
  Plus,
  Trash2,
  Upload,
  X,
  Star,
} from "lucide-react";

import { ProductService } from "@/app/services/product.service";
import { useCategories } from "@/app/hooks/use-categories";
import { useBrands } from "@/app/hooks/use-brands";

import type {
  ProductCreate,
  ProductImageCreate,
  ProductVariantCreate,
} from "@/app/types/product";

/* ================================================================
   CLOUDINARY CONFIGURATION
================================================================ */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PRODUCT_IMAGES = 10;

/* ================================================================
   TYPES
================================================================ */

interface VariantForm extends ProductVariantCreate {
  localId: string;
}

interface GalleryImage {
  localId: string;
  image_url: string;
  public_id: string;
  sort_order: number;
  is_cover: boolean;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

/* ================================================================
   HELPERS
================================================================ */

function createVariant(): VariantForm {
  return {
    localId: crypto.randomUUID(),
    price: 0,
    quantity: 0,
    color: "",
    size: "",
    is_default: true,
    is_available: true,
  };
}

function createGalleryImage(
  image: CloudinaryUploadResponse,
  sortOrder: number,
  isCover: boolean,
): GalleryImage {
  return {
    localId: crypto.randomUUID(),
    image_url: image.secure_url,
    public_id: image.public_id,
    sort_order: sortOrder,
    is_cover: isCover,
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

  const [material, setMaterial] = useState("");
  const [gender, setGender] = useState("");
  const [warranty, setWarranty] = useState("");

  /* ================================================================
     PRODUCT GALLERY
  ================================================================= */

  const [images, setImages] = useState<GalleryImage[]>([]);
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

  const uploadImageToCloudinary = async (
    file: File,
  ): Promise<CloudinaryUploadResponse> => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary configuration is missing. Check your environment variables.",
      );
    }

    if (!file.type.startsWith("image/")) {
      throw new Error(`"${file.name}" is not a valid image.`);
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(`"${file.name}" exceeds the 5MB image limit.`);
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
      const data = await response.json().catch(() => null);

      throw new Error(
        data?.error?.message ??
          `Failed to upload "${file.name}" to Cloudinary.`,
      );
    }

    return (await response.json()) as CloudinaryUploadResponse;
  };

  /* ================================================================
     HANDLE MULTIPLE IMAGE SELECTION
  ================================================================= */

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    // Reset the input so the same file can be selected again.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const remainingSlots = MAX_PRODUCT_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setError("A product can have a maximum of 10 images.");
      return;
    }

    if (files.length > remainingSlots) {
      setError(
        `You can add only ${remainingSlots} more image(s). The maximum is 10 images per product.`,
      );
      return;
    }

    try {
      setError(null);
      setUploadingImage(true);

      const uploadedImages: CloudinaryUploadResponse[] = [];

      for (const file of files) {
        const uploaded = await uploadImageToCloudinary(file);
        uploadedImages.push(uploaded);
      }

      setImages((current) => {
        const nextImages = [...current];

        uploadedImages.forEach((uploaded, index) => {
          const isFirstImage = nextImages.length === 0 && index === 0;

          nextImages.push(
            createGalleryImage(uploaded, nextImages.length, isFirstImage),
          );
        });

        return nextImages.map((image, index) => ({
          ...image,
          sort_order: index,
        }));
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to upload product images.",
      );
    } finally {
      setUploadingImage(false);
    }
  };

  /* ================================================================
     SET COVER IMAGE
  ================================================================= */

  const setCoverImage = (localId: string) => {
    setImages((current) =>
      current.map((image) => ({
        ...image,
        is_cover: image.localId === localId,
      })),
    );
  };

  /* ================================================================
     REMOVE IMAGE
  ================================================================= */

  const removeImage = (localId: string) => {
    setImages((current) => {
      const remaining = current.filter((image) => image.localId !== localId);

      // Keep one cover image whenever the gallery is not empty.
      const hasCover = remaining.some((image) => image.is_cover);

      return remaining.map((image, index) => ({
        ...image,
        sort_order: index,
        is_cover: image.is_cover || (!hasCover && index === 0),
      }));
    });
  };

  /* ================================================================
     VARIANT MANAGEMENT
  ================================================================= */

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      {
        ...createVariant(),
        is_default: false,
      },
    ]);
  };

  const removeVariant = (localId: string) => {
    setVariants((current) => {
      const remaining = current.filter(
        (variant) => variant.localId !== localId,
      );

      // Ensure a remaining variant is selected as default.
      if (
        remaining.length > 0 &&
        !remaining.some((variant) => variant.is_default)
      ) {
        remaining[0] = {
          ...remaining[0],
          is_default: true,
        };
      }

      return remaining;
    });
  };

  const updateVariant = (
    localId: string,
    field: keyof ProductVariantCreate,
    value: string | number | boolean,
  ) => {
    setVariants((current) =>
      current.map((variant) =>
        variant.localId === localId ? { ...variant, [field]: value } : variant,
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
      (variant) =>
        Number.isFinite(Number(variant.price)) &&
        Number(variant.price) >= 0 &&
        Number.isInteger(Number(variant.quantity)) &&
        Number(variant.quantity) >= 0,
    );

  const hasValidProductDetails =
    name.trim().length >= 2 &&
    name.trim().length <= 255 &&
    description.trim().length >= 1 &&
    categoryId !== "" &&
    (!brandId || Number.isInteger(Number(brandId))) &&
    material.length <= 100 &&
    gender.length <= 50 &&
    warranty.length <= 255;

  const hasValidGallery =
    images.length <= MAX_PRODUCT_IMAGES &&
    (images.length === 0 ||
      images.filter((image) => image.is_cover).length === 1);

  const isFormValid =
    hasValidProductDetails &&
    hasValidVariants &&
    hasValidGallery &&
    !uploadingImage;

  /* ================================================================
     SUBMIT
  ================================================================= */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (uploadingImage) {
      setError("Please wait for image uploads to finish.");
      return;
    }

    if (!isFormValid) {
      setError(
        "Check the required fields, product details, image gallery, and variant values.",
      );
      return;
    }

    try {
      setSaving(true);

      const cover = images.find((image) => image.is_cover);

      const productImages: ProductImageCreate[] = images.map(
        (image, index) => ({
          image_url: image.image_url,
          public_id: image.public_id || null,
          sort_order: index,
          is_cover: image.is_cover,
        }),
      );

      const payload: ProductCreate = {
        name: name.trim(),
        description: description.trim(),

        category_id: Number(categoryId),
        brand_id: brandId ? Number(brandId) : null,

        material: material.trim() || null,
        gender: gender.trim() || null,
        warranty: warranty.trim() || null,

        cover_image: cover?.image_url ?? null,
        cover_public_id: cover?.public_id ?? null,

        is_available: isAvailable,
        is_featured: isFeatured,

        variants: variants.map((variant) => ({
          price: Number(variant.price),
          quantity: Number(variant.quantity),

          color: variant.color?.trim() || null,
          size: variant.size?.trim() || null,

          is_default: variant.is_default ?? false,
          is_available: variant.is_available ?? true,
        })),

        images: productImages,
      };

      await ProductService.create(payload);

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            detail?: string | { msg?: string }[];
          };
        };
        message?: string;
      };

      const detail = apiError.response?.data?.detail;

      const errorMessage = Array.isArray(detail)
        ? detail.map((item) => item.msg ?? "Validation error").join(", ")
        : detail;

      setError(errorMessage || apiError.message || "Failed to create product.");
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
                Create a product, upload its gallery, and configure variants.
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 rounded p-1 hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFORMATION */}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              title="Basic Information"
              description="General information about this product."
            />

            <div className="grid gap-5">
              <Field label="Product Name" required>
                <input
                  required
                  minLength={2}
                  maxLength={255}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Classic Leather Watch"
                  className={inputClass}
                />
              </Field>

              <Field label="Description" required>
                <textarea
                  required
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
                    required
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

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Product Material">
                  <input
                    maxLength={100}
                    value={material}
                    onChange={(event) => setMaterial(event.target.value)}
                    placeholder="e.g. Genuine leather"
                    className={inputClass}
                  />
                </Field>

                <Field label="Gender">
                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Not specified</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Kids">Kids</option>
                  </select>
                </Field>
              </div>

              <Field label="Warranty">
                <input
                  maxLength={255}
                  value={warranty}
                  onChange={(event) => setWarranty(event.target.value)}
                  placeholder="e.g. 12 months warranty"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          {/* PRODUCT GALLERY */}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <SectionHeading
                title="Product Gallery"
                description="Upload up to 10 images. Choose one cover image for product listings."
              />

              <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {images.length}/{MAX_PRODUCT_IMAGES} images
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            {images.length > 0 && (
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image, index) => (
                  <div
                    key={image.localId}
                    className={`overflow-hidden rounded-xl border bg-white ${
                      image.is_cover
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="relative aspect-square bg-slate-100">
                      <Image
                        src={image.image_url}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />

                      {image.is_cover && (
                        <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">
                          COVER
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(image.localId)}
                        disabled={uploadingImage || saving}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2 p-3">
                      <p className="truncate text-xs text-slate-500">
                        Image {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => setCoverImage(image.localId)}
                        disabled={image.is_cover || uploadingImage || saving}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-default disabled:opacity-60"
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            image.is_cover ? "fill-current" : ""
                          }`}
                        />
                        {image.is_cover ? "Cover image" : "Set as cover"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {images.length < MAX_PRODUCT_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage || saving}
                className="flex min-h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />

                    <p className="mt-4 text-sm font-medium text-slate-700">
                      Uploading images...
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Please wait for the uploads to finish.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <ImageIcon className="h-6 w-6 text-slate-500" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-800">
                      Add product images
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PNG, JPG or WEBP · Maximum 5MB per image
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                      <Upload className="h-4 w-4" />
                      Choose Images
                    </span>
                  </>
                )}
              </button>
            )}

            {images.length === 0 && (
              <p className="mt-3 text-xs text-slate-500">
                You can create a product without gallery images. If you add
                images, select one as the cover.
              </p>
            )}

            {images.length > 0 && (
              <p className="mt-4 text-xs text-slate-500">
                The cover image is also saved to the product&apos;s cover_image
                and cover_public_id fields.
              </p>
            )}
          </section>

          {/* VISIBILITY */}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              title="Visibility"
              description="Control how this product appears in your store."
            />

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
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <SectionHeading
                title="Product Variants"
                description="Configure prices, stock quantities, colors, and sizes."
              />

              <button
                type="button"
                onClick={addVariant}
                disabled={saving}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
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
                        disabled={saving}
                        aria-label={`Remove variant ${index + 1}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Price" required>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={variant.price}
                        onChange={(event) =>
                          updateVariant(
                            variant.localId,
                            "price",
                            event.target.value === ""
                              ? 0
                              : Number(event.target.value),
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
                        step="1"
                        required
                        value={variant.quantity}
                        onChange={(event) =>
                          updateVariant(
                            variant.localId,
                            "quantity",
                            event.target.value === ""
                              ? 0
                              : Number(event.target.value),
                          )
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Color">
                      <input
                        maxLength={100}
                        value={variant.color ?? ""}
                        onChange={(event) =>
                          updateVariant(
                            variant.localId,
                            "color",
                            event.target.value,
                          )
                        }
                        placeholder="e.g. Gold"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Size">
                      <input
                        maxLength={100}
                        value={variant.size ?? ""}
                        onChange={(event) =>
                          updateVariant(
                            variant.localId,
                            "size",
                            event.target.value,
                          )
                        }
                        placeholder="e.g. Large"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="mt-5">
                    <Checkbox
                      checked={variant.is_default ?? false}
                      onChange={() => setDefaultVariant(variant.localId)}
                      label="Default variant"
                      description="Use this variant as the default selection."
                    />
                  </div>

                  <div className="mt-4">
                    <Checkbox
                      checked={variant.is_available ?? true}
                      onChange={(checked) =>
                        updateVariant(variant.localId, "is_available", checked)
                      }
                      label="Variant is available"
                      description="Allow this variant to be selected."
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
              ) : uploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Images...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ================================================================
   SECTION HEADING
================================================================ */

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
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
  children: ReactNode;
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
