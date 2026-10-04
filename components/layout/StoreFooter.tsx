import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="mt-20 border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Store</h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Quality products, simple shopping, and secure payments delivered
            directly to you.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Shop</h3>

          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <Link href="/shop" className="block hover:text-slate-900">
              All Products
            </Link>

            <Link href="/categories" className="block hover:text-slate-900">
              Categories
            </Link>

            <Link href="/orders" className="block hover:text-slate-900">
              My Orders
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Account</h3>

          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <Link href="/auth/login" className="block hover:text-slate-900">
              Login
            </Link>

            <Link href="/auth/register" className="block hover:text-slate-900">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
