import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function StoreFooter() {
  return (
    <footer className="mt-20 border-t border-brand-border bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-20">
          {/* ============================================================
              BRAND
          ============================================================ */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-obsidian text-sm font-bold tracking-tight text-brand-champagne shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand-espresso">
                SK
              </div>

              <div className="leading-none">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-obsidian">
                  Luxury
                </span>

                <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.28em] text-brand-muted">
                  Store
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-brand-muted">
              Thoughtfully selected jewelry, watches, and accessories for people
              who appreciate timeless style and refined details.
            </p>

            <Link
              href="/shop"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-obsidian transition-colors duration-200 hover:text-brand-champagne"
            >
              Explore the collection
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* ============================================================
              SHOP
          ============================================================ */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-champagne">
              Shop
            </p>

            <div className="mt-5 space-y-3">
              <FooterLink href="/shop">All Products</FooterLink>
              <FooterLink href="/categories">Categories</FooterLink>
              <FooterLink href="/brands">Brands</FooterLink>
              <FooterLink href="/orders">My Orders</FooterLink>
            </div>
          </div>

          {/* ============================================================
              ACCOUNT
          ============================================================ */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-champagne">
              Account
            </p>

            <div className="mt-5 space-y-3">
              <FooterLink href="/auth/login">Login</FooterLink>

              <FooterLink href="/auth/register">Create Account</FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          BOTTOM BAR
      ================================================================ */}
      <div className="border-t border-brand-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} SK Luxury Store. All rights reserved.
          </p>

          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-muted">
            Timeless pieces. Refined living.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   FOOTER LINK
================================================================ */

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center gap-1.5 text-sm text-brand-muted transition-colors duration-200 hover:text-brand-obsidian"
    >
      <span>{children}</span>

      <ArrowUpRight className="h-3.5 w-3.5 text-brand-champagne opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
}
