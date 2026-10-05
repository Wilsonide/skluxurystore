"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Boxes,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  Store,
  Tags,
  X,
} from "lucide-react";

import { useAuthStore } from "@/app/store/auth-store";
import { AuthService } from "../services/auth.service";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Boxes,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    name: "Brands",
    href: "/admin/brands",
    icon: Tags,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
];

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "STORE_ADMIN"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const logout = useAuthStore((state) => state.logout);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * ============================================================
   * AUTHORIZATION GUARD
   * ============================================================
   */
  useEffect(() => {
    if (!hydrated) {
      return;
    }

    /**
     * User is not authenticated.
     */
    if (!user) {
      router.replace(`/auth/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    /**
     * Check admin role.
     */
    const role = user.role?.toUpperCase();
    const isAdmin = ADMIN_ROLES.includes(role);

    /**
     * Authenticated but not an admin.
     */
    if (!isAdmin) {
      router.replace("/");
    }
  }, [hydrated, user, pathname, router]);

  /**
   * ============================================================
   * PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
   * ============================================================
   */
  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /**
   * ============================================================
   * WAITING FOR AUTH STATE
   * ============================================================
   */
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ivory px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold-light bg-brand-gold-soft">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-champagne border-t-transparent" />
          </div>

          <p className="mt-5 text-sm font-medium tracking-wide text-brand-champagne">
            Store Administration
          </p>

          <p className="mt-1 text-sm text-brand-muted">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  /**
   * ============================================================
   * NOT AUTHENTICATED
   * ============================================================
   */
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ivory px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold-light bg-brand-gold-soft">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-champagne border-t-transparent" />
          </div>

          <p className="mt-5 text-sm text-brand-muted">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  /**
   * ============================================================
   * ADMIN AUTHORIZATION
   * ============================================================
   */
  const role = user.role?.toUpperCase();
  const isAdmin = ADMIN_ROLES.includes(role);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ivory px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-border bg-brand-cream">
            <Store className="h-6 w-6 text-brand-champagne" />
          </div>

          <h1 className="mt-6 text-xl font-semibold text-brand-obsidian">
            Access denied
          </h1>

          <p className="mt-2 text-sm leading-6 text-brand-muted">
            You do not have permission to access the administration area.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-obsidian px-5 py-3 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
          >
            <Store className="h-4 w-4" />
            Visit Store
          </Link>
        </div>
      </div>
    );
  }

  /**
   * ============================================================
   * LOGOUT
   * ============================================================
   */
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
      window.location.href = "/";
    }
  };

  /**
   * ============================================================
   * NAVIGATION
   * ============================================================
   */
  const renderNavigation = (mobile = false) => {
    return navigation.map((item) => {
      const Icon = item.icon;

      const active =
        item.href === "/admin"
          ? pathname === "/admin"
          : pathname.startsWith(item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => {
            if (mobile) {
              setMobileMenuOpen(false);
            }
          }}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            active
              ? "bg-brand-obsidian text-brand-gold-light shadow-sm"
              : "text-brand-muted-dark hover:bg-brand-cream hover:text-brand-obsidian"
          }`}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span>{item.name}</span>
        </Link>
      );
    });
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="flex min-h-screen">
        {/* ================================================== */}
        {/* DESKTOP SIDEBAR */}
        {/* ================================================== */}

        <aside className="hidden w-64 shrink-0 border-r border-brand-border bg-brand-warm-white lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-brand-border px-6">
            <Link
              href="/admin"
              className="text-xl font-bold tracking-tight text-brand-obsidian"
            >
              Store Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {renderNavigation()}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 border-t border-brand-border p-4">
            {/* Visit Store */}
            <Link
              href="/shop"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-muted-dark transition hover:bg-brand-cream hover:text-brand-obsidian"
            >
              <Store className="h-4 w-4" />
              <span>Visit Store</span>
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-muted-dark transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ================================================== */}
        {/* MOBILE SIDEBAR OVERLAY */}
        {/* ================================================== */}

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" aria-hidden="true">
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-brand-obsidian/40 backdrop-blur-[2px]"
            />

            {/* Drawer */}
            <aside
              className="relative flex h-full w-[min(86vw,320px)] flex-col border-r border-brand-border bg-brand-warm-white shadow-2xl"
              aria-label="Admin navigation"
            >
              {/* Drawer Header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-brand-border px-5">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold tracking-tight text-brand-obsidian"
                >
                  Store Admin
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2 text-brand-muted transition hover:bg-brand-cream hover:text-brand-obsidian"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {renderNavigation(true)}
              </nav>

              {/* Bottom Actions */}
              <div className="shrink-0 space-y-2 border-t border-brand-border p-4">
                {/* Visit Store */}
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-muted-dark transition hover:bg-brand-cream hover:text-brand-obsidian"
                >
                  <Store className="h-4 w-4" />
                  <span>Visit Store</span>
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-muted-dark transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* ================================================== */}
        {/* MAIN */}
        {/* ================================================== */}

        <div className="min-w-0 flex-1">
          {/* ================================================== */}
          {/* MOBILE HEADER */}
          {/* ================================================== */}

          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-brand-border bg-brand-warm-white/95 px-4 backdrop-blur lg:hidden">
            <div className="flex min-w-0 items-center gap-3">
              {/* Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-cream text-brand-obsidian transition hover:border-brand-border-dark hover:bg-brand-gold-soft"
                aria-label="Open admin navigation"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Brand */}
              <Link
                href="/admin"
                className="truncate text-lg font-bold tracking-tight text-brand-obsidian"
              >
                Store Admin
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {/* Visit Store */}
              <Link
                href="/shop"
                className="rounded-xl p-2.5 text-brand-muted transition hover:bg-brand-cream hover:text-brand-obsidian"
                aria-label="Visit Store"
                title="Visit Store"
              >
                <Store className="h-5 w-5" />
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl p-2.5 text-brand-muted transition hover:bg-red-50 hover:text-red-600"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* ================================================== */}
          {/* PAGE CONTENT */}
          {/* ================================================== */}

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
