/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Gem,
  Watch,
  Sparkles,
  CircleDot,
} from "lucide-react";

import ProductGrid from "@/components/products/ProductGrid";
import { useProducts } from "@/app/hooks/use-products";
import { useCategories } from "@/app/hooks/use-categories";

const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85";

export default function StoreHomePage() {
  const { products, loading: productsLoading } = useProducts({
    featured: true,
    page: 1,
    page_size: 8,
  });

  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <main className="bg-white text-slate-950">
      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-50/70 blur-3xl" />
          <div className="absolute -bottom-48 -left-40 h-[450px] w-[450px] rounded-full bg-slate-50 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:px-8 lg:py-24">
          {/* Hero content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/70 px-3.5 py-1.5 text-xs font-semibold text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />
              Jewelry · Watches · Accessories
            </div>

            <h1 className="mt-6 max-w-2xl text-5xl font-bold leading-[1.05] tracking-[-0.035em] text-slate-950 sm:text-6xl lg:text-[4.5rem]">
              Elevate your style.
              <span className="mt-2 block text-slate-400">
                Keep it timeless.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Discover carefully selected watches, jewelry and accessories
              designed to bring a refined touch to every look.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/categories"
                className="inline-flex h-12 items-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Explore Categories
              </Link>
            </div>

            {/* Trust points */}
            <div className="mt-12 grid max-w-2xl gap-6 border-t border-slate-200 pt-6 sm:grid-cols-3">
              <TrustPoint
                title="Carefully Selected"
                description="Quality pieces chosen with elegance in mind."
              />

              <TrustPoint
                title="Secure Checkout"
                description="Shop confidently with protected payments."
              />

              <TrustPoint
                title="Easy Delivery"
                description="Convenient delivery straight to you."
              />
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden min-h-[500px] lg:block">
            <div className="absolute inset-4 rounded-[2rem] bg-slate-50" />

            <div className="absolute left-[10%] top-[7%] h-[390px] w-[80%] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-50" />

              <div className="relative flex h-full flex-col p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Signature Collection
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-950">
                      Timeless Details
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
                    <Watch className="h-4.5 w-4.5" />
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-center">
                  <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 via-white to-slate-100">
                    <div className="absolute h-36 w-36 rounded-full border-[9px] border-slate-900" />

                    <div className="absolute h-24 w-24 rounded-full border-4 border-amber-300" />

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <Gem className="h-5 w-5 text-amber-500" />
                    </div>

                    <div className="absolute right-1 top-8 h-4 w-4 rounded-full bg-amber-300" />

                    <div className="absolute bottom-0 left-9 h-3.5 w-3.5 rounded-full bg-slate-900" />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Jewelry & Accessories
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pieces that complete your look.
                    </p>
                  </div>

                  <Link
                    href="/shop"
                    aria-label="Shop jewelry"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-950 hover:text-white"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Watches */}
            <div className="absolute -left-1 bottom-[10%] flex w-48 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                <Watch className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-950">Watches</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Classic & modern
                </p>
              </div>
            </div>

            {/* Necklaces */}
            <div className="absolute -right-1 bottom-[22%] flex w-48 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <CircleDot className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Necklaces
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Elegant finishing touches
                </p>
              </div>
            </div>

            {/* Small accent */}
            <div className="absolute right-[7%] top-[3%] flex h-12 w-12 items-center justify-center rounded-full border border-amber-200 bg-amber-50">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BENEFITS
      ============================================================ */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <Benefit
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Secure Shopping"
            description="Secure checkout and protected payments."
          />

          <Benefit
            icon={<Truck className="h-5 w-5" />}
            title="Reliable Delivery"
            description="Convenient delivery for every purchase."
          />

          <Benefit
            icon={<Star className="h-5 w-5" />}
            title="Quality Pieces"
            description="Stylish products selected for quality and beauty."
          />
        </div>
      </section>

      {/* ============================================================
          CATEGORIES
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Explore"
          title="Shop by Category"
          description="Find the perfect piece for your style."
          href="/categories"
        />

        {categoriesLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 py-12 text-center">
            <p className="text-sm text-slate-500">
              No categories available yet.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* ============================================================
          FEATURED PRODUCTS
      ============================================================ */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Curated for you"
            title="Featured Pieces"
            description="Discover some of our most-loved watches, jewelry and accessories."
            href="/shop"
          />

          <div className="mt-8">
            <ProductGrid
              products={products as any}
              isLoading={productsLoading}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-center sm:px-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                Find your next favorite
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Timeless pieces. Effortless style.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Explore our collection of watches, jewelry and accessories and
                find something that feels uniquely yours.
              </p>

              <Link
                href="/shop"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Explore the Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================================================================
   CATEGORY CARD
================================================================ */

function CategoryCard({ category }: { category: any }) {
  /*
   * Fetch only the first product belonging to this category.
   *
   * If a product exists and has a cover image, that image becomes
   * the category card image.
   *
   * If there is no product or no product image, the premium default
   * jewelry image is used instead.
   */
  const { products, loading } = useProducts({
    category_id: category.id,
    page: 1,
    page_size: 1,
  });

  const productImage = products?.[0]?.cover_image || DEFAULT_CATEGORY_IMAGE;

  return (
    <Link
      href={`/shop?category_id=${category.id}`}
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      {!loading ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url("${productImage}")`,
          }}
        />
      ) : (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      )}

      {/* Image overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

      {/* Category content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Collection
            </p>

            <h3 className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
              {category.name}
            </h3>
          </div>

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-sm transition duration-300 group-hover:bg-amber-400 group-hover:text-slate-950">
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ================================================================
   SECTION HEADING
================================================================ */

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <Link
        href={href}
        className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-900 transition hover:text-amber-700 sm:flex"
      >
        View all
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* ================================================================
   TRUST POINT
================================================================ */

function TrustPoint({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-950">{title}</p>

      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

/* ================================================================
   BENEFIT
================================================================ */

function Benefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 border-b border-slate-100 py-6 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
