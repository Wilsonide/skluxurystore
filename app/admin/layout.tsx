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
  ShoppingBag,
  Tags,
  Store,
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
  const logout = useAuthStore((state) => state.logout);

  const [hydrated, setHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated(),
  );

  /*
   * ============================================================
   * WAIT FOR ZUSTAND AUTH STORE TO HYDRATE
   * ============================================================
   */

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return unsubscribe;
  }, []);

  /*
   * ============================================================
   * AUTHORIZATION GUARD
   * ============================================================
   */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    /*
     * User is not authenticated.
     */
    if (!user) {
      router.replace(`/auth/login?from=${encodeURIComponent(pathname)}`);

      return;
    }

    /*
     * Check admin role.
     */
    const role = user.role?.toUpperCase();

    const isAdmin = ADMIN_ROLES.includes(role);

    /*
     * Authenticated but not an admin.
     */
    if (!isAdmin) {
      router.replace("/");
    }
  }, [hydrated, user, pathname, router]);

  /*
   * ============================================================
   * WAITING FOR AUTH STATE
   * ============================================================
   */

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-500">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * NOT AUTHENTICATED
   * ============================================================
   */

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * ADMIN AUTHORIZATION
   * ============================================================
   */

  const role = user.role?.toUpperCase();

  const isAdmin = ADMIN_ROLES.includes(role);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Access denied
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            You do not have permission to access this area.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Store className="h-4 w-4" />
            Visit Store
          </Link>
        </div>
      </div>
    );
  }

  /*
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

  /*
   * ============================================================
   * ADMIN UI
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r bg-white lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link
              href="/admin"
              className="text-xl font-bold tracking-tight text-slate-950"
            >
              Store Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 border-t p-4">
            {/* Visit Store */}
            <Link
              href="/shop"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <Store className="h-4 w-4" />

              <span>Visit Store</span>
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />

              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="min-w-0 flex-1">
          {/* Mobile header */}
          <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
            <Link href="/admin" className="text-lg font-bold text-slate-950">
              Store Admin
            </Link>

            <div className="flex items-center gap-2">
              {/* Visit Store */}
              <Link
                href="/shop"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                aria-label="Visit Store"
                title="Visit Store"
              >
                <Store className="h-5 w-5" />
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
