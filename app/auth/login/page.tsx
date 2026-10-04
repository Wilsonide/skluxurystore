import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

function LoginPageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      {" "}
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-border border-t-brand-champagne" />{" "}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      {" "}
      <LoginForm />{" "}
    </Suspense>
  );
}
