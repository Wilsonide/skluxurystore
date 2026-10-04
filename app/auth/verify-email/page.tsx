import { Suspense } from "react";
import VerificationPage from "@/components/auth/VerifyEmail";

function VerifyEmailFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-brand-ivory px-4">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold-light bg-brand-gold-soft">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-champagne border-t-transparent" />
        </div>

        <p className="mt-4 text-sm text-brand-muted">Verifying your email...</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerificationPage />
    </Suspense>
  );
}
