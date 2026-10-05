import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-brand-ivory">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-brand-gold-soft/20 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-brand-cream/60 blur-3xl sm:h-96 sm:w-96" />
      </div>

      {/* Content */}
      <div
        className="
          relative
          flex
          min-h-screen
          w-full
          justify-center
          px-3
          py-6
          sm:px-6
          sm:py-10
        "
        style={{
          paddingTop: "max(1.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* Auth container */}
        <div className="mx-auto w-full max-w-[430px]">
          {/* Branding */}
          <div className="mb-5 w-full text-center sm:mb-7">
            <Link
              href="/"
              className="inline-flex items-center justify-center"
              aria-label="Luxury Store home"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-obsidian text-xs font-bold tracking-wide text-brand-gold-light shadow-md shadow-brand-obsidian/10 sm:h-12 sm:w-12 sm:text-base">
                SK
              </div>
            </Link>

            <h1 className="mt-2.5 text-lg font-semibold tracking-tight text-brand-obsidian sm:mt-4 sm:text-2xl">
              Luxury Store
            </h1>

            <p className="mx-auto mt-1 max-w-[280px] text-[11px] leading-4 text-brand-muted sm:text-sm sm:leading-5">
              Quality products. Simple shopping.
            </p>
          </div>

          {/* Auth Card */}
          <div
            className="
              mx-auto
              w-full
              max-w-[430px]
              box-border
              rounded-2xl
              border
              border-brand-border
              bg-brand-warm-white
              p-4
              shadow-xl
              shadow-brand-espresso/5
              sm:rounded-2xl
              sm:p-7
            "
          >
            {children}
          </div>

          {/* Footer */}
          <p className="mx-auto mt-4 w-full max-w-[320px] px-2 text-center text-[10px] leading-4 text-brand-muted sm:mt-5 sm:px-0 sm:text-xs sm:leading-5">
            Your account information is securely protected.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
