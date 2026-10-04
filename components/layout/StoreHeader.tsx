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
  Sparkles,
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
    <header className="sticky top-0 z-50 border-b border-brand-border/80 bg-brand-warm-white/95 backdrop-blur-xl">
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
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-obsidian text-sm font-bold tracking-tight text-brand-gold-light shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md sm:h-11 sm:w-11">
              <span className="relative">SK</span>

              {/* Small luxury accent */}
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-brand-warm-white bg-brand-champagne" />
            </div>

            <div className="hidden sm:block">
              <div className="text-[15px] font-bold tracking-[0.18em] text-brand-obsidian">
                LUXURY
              </div>

              <div className="mt-[-1px] text-[10px] font-medium tracking-[0.28em] text-brand-muted">
                STORE
              </div>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/shop">Shop</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/brands">Brands</NavLink>
          </nav>

          {/* =====================================================
              SEARCH
          ====================================================== */}

          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 flex-1 md:flex lg:mx-auto lg:max-w-xl"
          >
            <div className="group relative w-full">
              <Search className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-brand-muted transition-colors duration-200 group-focus-within:text-brand-champagne" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands..."
                className="h-11 w-full rounded-full border border-brand-border bg-brand-cream/50 pl-11 pr-5 text-sm text-brand-obsidian outline-none transition-all duration-200 placeholder:text-brand-muted hover:border-brand-border-dark hover:bg-white focus:border-brand-champagne focus:bg-white focus:ring-4 focus:ring-brand-gold-light/25"
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
              className="flex h-10 w-10 items-center justify-center rounded-full text-brand-muted-dark transition-all duration-200 hover:bg-brand-cream hover:text-brand-obsidian md:hidden"
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
                className={`flex h-10 items-center gap-2 rounded-full border px-2.5 transition-all duration-200 ${
                  accountOpen
                    ? "border-brand-border-dark bg-brand-cream text-brand-obsidian"
                    : "border-transparent text-brand-muted-dark hover:border-brand-border hover:bg-brand-cream hover:text-brand-obsidian"
                }`}
                aria-label={
                  user ? `Account menu for ${user.name}` : "Open account menu"
                }
                aria-expanded={accountOpen}
              >
                {user ? (
                  <>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-obsidian text-[11px] font-bold text-brand-gold-light">
                      {userInitial}
                    </span>

                    <span className="hidden max-w-[100px] truncate text-sm font-medium text-brand-espresso md:block">
                      {user.name}
                    </span>
                  </>
                ) : (
                  <>
                    <UserRound className="h-[19px] w-[19px]" />

                    <span className="hidden text-sm font-medium md:block">
                      Sign in
                    </span>
                  </>
                )}

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

                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[280px] overflow-hidden rounded-2xl border border-brand-border bg-white p-2 shadow-[0_20px_50px_rgba(58,42,34,0.14)]">
                    {user ? (
                      <>
                        {/* User information */}

                        <div className="mb-2 rounded-xl bg-brand-ivory p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-obsidian text-sm font-semibold text-brand-gold-light">
                              {userInitial}

                              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-brand-ivory bg-brand-champagne" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-brand-obsidian">
                                {user.name}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-brand-muted">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Account */}

                        <AccountLink
                          href="/account"
                          icon={<UserRound className="h-4 w-4" />}
                          onClick={() => setAccountOpen(false)}
                        >
                          My Account
                        </AccountLink>

                        {/* Orders */}

                        <AccountLink
                          href="/account/orders"
                          icon={<Package className="h-4 w-4" />}
                          onClick={() => setAccountOpen(false)}
                        >
                          My Orders
                        </AccountLink>

                        {/* Admin */}

                        {isAdmin && (
                          <>
                            <div className="my-2 border-t border-brand-border" />

                            <AccountLink
                              href="/admin"
                              icon={<LayoutDashboard className="h-4 w-4" />}
                              onClick={() => setAccountOpen(false)}
                            >
                              Admin Dashboard
                            </AccountLink>
                          </>
                        )}

                        {/* Logout */}

                        <div className="my-2 border-t border-brand-border" />

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
                        <div className="rounded-xl bg-brand-ivory px-3 py-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-brand-champagne" />

                            <p className="text-sm font-semibold text-brand-obsidian">
                              Welcome
                            </p>
                          </div>

                          <p className="mt-1 text-xs leading-5 text-brand-muted">
                            Sign in to view your account and orders.
                          </p>
                        </div>

                        <Link
                          href="/auth/login"
                          onClick={() => setAccountOpen(false)}
                          className="mt-2 flex items-center justify-center rounded-xl bg-brand-obsidian px-4 py-3 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
                        >
                          Login
                        </Link>

                        <Link
                          href="/auth/register"
                          onClick={() => setAccountOpen(false)}
                          className="mt-1 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-brand-espresso transition hover:bg-brand-ivory"
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
              className="group relative flex h-10 w-10 items-center justify-center rounded-full text-brand-muted-dark transition-all duration-200 hover:bg-brand-cream hover:text-brand-obsidian"
              aria-label={`Shopping cart${
                itemCount > 0 ? `, ${itemCount} items` : ""
              }`}
            >
              <ShoppingBag className="h-[19px] w-[19px] transition-transform duration-200 group-hover:-translate-y-0.5" />

              {itemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-brand-warm-white bg-brand-obsidian px-1 text-[9px] font-bold leading-none text-brand-gold-light">
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
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 lg:hidden ${
                mobileOpen
                  ? "bg-brand-obsidian text-brand-gold-light"
                  : "text-brand-muted-dark hover:bg-brand-cream hover:text-brand-obsidian"
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
        <div className="border-t border-brand-border bg-brand-warm-white lg:hidden">
          <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6">
            {/* Mobile Search */}

            <form onSubmit={handleSearch} className="mb-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-brand-muted" />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, brands..."
                  className="h-11 w-full rounded-full border border-brand-border bg-brand-cream/50 pl-11 pr-4 text-sm text-brand-obsidian outline-none transition focus:border-brand-champagne focus:bg-white focus:ring-4 focus:ring-brand-gold-light/25"
                />
              </div>
            </form>

            {/* Navigation */}

            <nav className="space-y-1">
              <MobileNavLink href="/shop" onClick={() => setMobileOpen(false)}>
                Shop
              </MobileNavLink>

              <MobileNavLink
                href="/categories"
                onClick={() => setMobileOpen(false)}
              >
                Categories
              </MobileNavLink>

              <MobileNavLink
                href="/brands"
                onClick={() => setMobileOpen(false)}
              >
                Brands
              </MobileNavLink>

              {user && (
                <>
                  <div className="my-3 border-t border-brand-border" />

                  <MobileNavLink
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                  >
                    My Account
                  </MobileNavLink>

                  <MobileNavLink
                    href="/account/orders"
                    onClick={() => setMobileOpen(false)}
                  >
                    My Orders
                  </MobileNavLink>
                </>
              )}

              {isAdmin && (
                <>
                  <div className="my-3 border-t border-brand-border" />

                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-brand-cream px-3 py-3.5 text-sm font-semibold text-brand-espresso transition hover:bg-brand-gold-light/40"
                  >
                    Admin Dashboard
                    <LayoutDashboard className="h-4 w-4 text-brand-muted-dark" />
                  </Link>
                </>
              )}

              {!user && (
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-brand-border pt-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-brand-obsidian px-4 py-3 text-sm font-semibold text-brand-gold-light transition hover:bg-brand-espresso"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-brand-border-dark px-4 py-3 text-sm font-semibold text-brand-espresso transition hover:border-brand-champagne hover:bg-brand-ivory"
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

/* ================================================================
   DESKTOP NAV LINK
================================================================ */

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-lg px-3.5 py-2 text-sm font-medium text-brand-muted-dark transition-colors duration-200 hover:bg-brand-cream hover:text-brand-obsidian"
    >
      {children}

      <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-brand-champagne transition-all duration-300 group-hover:w-4/5" />
    </Link>
  );
}

/* ================================================================
   ACCOUNT LINK
================================================================ */

function AccountLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-brand-espresso transition hover:bg-brand-ivory hover:text-brand-obsidian"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-cream text-brand-muted-dark transition group-hover:bg-brand-gold-light/40 group-hover:text-brand-espresso">
        {icon}
      </span>

      <span className="flex-1">{children}</span>

      <ArrowRight className="h-3.5 w-3.5 text-brand-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
}

/* ================================================================
   MOBILE NAV LINK
================================================================ */

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium text-brand-espresso transition hover:bg-brand-cream hover:text-brand-obsidian"
    >
      <span>{children}</span>

      <ArrowRight className="h-4 w-4 text-brand-muted transition group-hover:translate-x-0.5 group-hover:text-brand-champagne" />
    </Link>
  );
}
