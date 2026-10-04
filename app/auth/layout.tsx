import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-start justify-center px-4 py-8 sm:items-center sm:py-10">
        <div className="w-full max-w-md">
          {/* Branding */}
          <div className="mb-5 text-center sm:mb-6">
            <Link href="/" className="inline-flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm">
                SK
              </div>
            </Link>

            <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Luxury Store
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Quality products. Simple shopping.
            </p>
          </div>

          {/* Auth card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 sm:p-7">
            {children}
          </div>

          {/* Footer */}
          <p className="mt-4 text-center text-[11px] text-slate-400 sm:mt-5 sm:text-xs">
            Your account information is securely protected.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
