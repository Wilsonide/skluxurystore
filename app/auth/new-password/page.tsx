import { Suspense } from "react";
import { NewPasswordForm } from "@/components/auth/NewPasswordForm";

function NewPasswordPageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-brand-ivory px-4">
      {" "}
      <div className="text-center">
        {" "}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold-light bg-brand-gold-soft">
          {" "}
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-champagne border-t-transparent" />{" "}
        </div>
        <p className="mt-4 text-sm text-brand-muted">Loading...</p>
      </div>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<NewPasswordPageFallback />}>
      {" "}
      <NewPasswordForm />{" "}
    </Suspense>
  );
}
