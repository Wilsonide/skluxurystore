"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  ChevronDown,
  Package,
  LogOut,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

import { useCartStore } from "@/app/store/cart-store";
import { useAuthStore } from "@/app/store/auth-store";
import { AuthService } from "@/app/services/auth.service";

export function StoreHeader() {
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "STORE_ADMIN";

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    window.location.href = `/shop?search=${encodeURIComponent(query)}`;
  };

  const closeMenus = () => {
    setAccountOpen(false);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logoutStore();
      closeMenus();
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      {/* =========================================================
          MAIN HEADER
      ========================================================== */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center gap-4 lg:h-[78px] lg:gap-8">
          {/* =====================================================
              LOGO
          ====================================================== */}
          <Link
            href="/"
            onClick={closeMenus}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold tracking-tight text-white shadow-sm transition duration-300 group-hover:scale-[1.03] group-hover:shadow-md sm:h-11 sm:w-11">
              SK
            </div>

            <div className="hidden sm:block">
              <div className="text-[15px] font-bold tracking-[0.18em] text-slate-950">
                LUXURY
              </div>

              <div className="mt-[-1px] text-[10px] font-medium tracking-[0.28em] text-slate-400">
                STORE
              </div>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/shop"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Shop
            </Link>

            <Link
              href="/categories"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Categories
            </Link>

            <Link
              href="/brands"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Brands
            </Link>
          </nav>

          {/* =====================================================
              SEARCH
          ====================================================== */}
          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 flex-1 md:flex lg:mx-auto lg:max-w-xl"
          >
            <div className="group relative w-full">
              <Search className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400 transition group-focus-within:text-slate-600" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands..."
                className="h-11 w-full rounded-full border border-slate-200 bg-slate-50/80 pl-11 pr-5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </form>

          {/* =====================================================
              ACTIONS
          ====================================================== */}
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Mobile Search */}
            <Link
              href="/shop"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 md:hidden"
              aria-label="Search"
            >
              <Search className="h-[19px] w-[19px]" />
            </Link>

            {/* =================================================
                ACCOUNT
            ================================================== */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setAccountOpen((open) => !open);
                  setMobileOpen(false);
                }}
                className={`flex h-10 items-center gap-2 rounded-full border px-2.5 transition ${
                  accountOpen
                    ? "border-slate-300 bg-slate-100 text-slate-950"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                }`}
                aria-label={
                  user ? `Account menu for ${user.name}` : "Open account menu"
                }
                aria-expanded={accountOpen}
              >
                {user ? (
                  <>
                    {/* Logged-in avatar */}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[11px] font-bold text-white">
                      {userInitial}
                    </span>

                    {/* Name on larger screens */}
                    <span className="hidden max-w-[100px] truncate text-sm font-medium text-slate-700 md:block">
                      {user.name}
                    </span>
                  </>
                ) : (
                  <>
                    {/* Logged-out icon */}
                    <UserRound className="h-[19px] w-[19px]" />

                    <span className="hidden text-sm font-medium md:block">
                      Sign in
                    </span>
                  </>
                )}

                {/* Always visible so the user knows this opens a menu */}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <>
                  {/* Overlay */}
                  <button
                    type="button"
                    aria-label="Close account menu"
                    className="fixed inset-0 z-40 cursor-default bg-transparent"
                    onClick={() => setAccountOpen(false)}
                  />

                  {/* Dropdown */}
                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                    {user ? (
                      <>
                        {/* User information */}
                        <div className="mb-2 rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                              {userInitial}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-950">
                                {user.name}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Account */}
                        <Link
                          href="/account"
                          onClick={() => setAccountOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-white">
                            <UserRound className="h-4 w-4" />
                          </span>

                          <span className="flex-1">My Account</span>

                          <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </Link>

                        {/* Orders */}
                        <Link
                          href="/account/orders"
                          onClick={() => setAccountOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-white">
                            <Package className="h-4 w-4" />
                          </span>

                          <span className="flex-1">My Orders</span>

                          <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </Link>

                        {/* Admin */}
                        {isAdmin && (
                          <>
                            <div className="my-2 border-t border-slate-100" />

                            <Link
                              href="/admin"
                              onClick={() => setAccountOpen(false)}
                              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                                <LayoutDashboard className="h-4 w-4" />
                              </span>

                              <span className="flex-1">Admin Dashboard</span>

                              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                            </Link>
                          </>
                        )}

                        {/* Logout */}
                        <div className="my-2 border-t border-slate-100" />

                        <button
                          type="button"
                          disabled={loading}
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                            <LogOut className="h-4 w-4" />
                          </span>

                          <span>{loading ? "Logging out..." : "Logout"}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-3">
                          <p className="text-sm font-semibold text-slate-950">
                            Welcome
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Sign in to view your account and orders.
                          </p>
                        </div>

                        <Link
                          href="/auth/login"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Login
                        </Link>

                        <Link
                          href="/auth/register"
                          onClick={() => setAccountOpen(false)}
                          className="mt-1 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* =================================================
                CART
            ================================================== */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              aria-label={`Shopping cart${
                itemCount > 0 ? `, ${itemCount} items` : ""
              }`}
            >
              <ShoppingBag className="h-[19px] w-[19px]" />

              {itemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-slate-950 px-1 text-[9px] font-bold leading-none text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================== */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen((open) => !open);
                setAccountOpen(false);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition lg:hidden ${
                mobileOpen
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-[19px] w-[19px]" />
              ) : (
                <Menu className="h-[19px] w-[19px]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE MENU
      ========================================================== */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, brands..."
                  className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </form>

            {/* Navigation */}
            <nav className="space-y-1">
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Shop
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>

              <Link
                href="/categories"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Categories
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>

              <Link
                href="/brands"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Brands
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>

              {user && (
                <>
                  <div className="my-3 border-t border-slate-100" />

                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                  >
                    My Account
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                  </Link>

                  <Link
                    href="/account/orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                  >
                    My Orders
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <div className="my-3 border-t border-slate-100" />

                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    Admin Dashboard
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                </>
              )}

              {!user && (
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
