"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { MailCheck, AlertCircle } from "lucide-react";

import { Axios } from "@/lib/axios";

const VerificationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const verifyEmail = useCallback(async () => {
    if (!token) {
      setError("Verification link is invalid or missing.");
      setLoading(false);
      return;
    }

    try {
      const res = await Axios.get(`/auth/verify-email?token=${token}`);

      setSuccess(res.data?.message || "Email verified successfully");
      setError(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Verification failed. The link may have expired.",
      );
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  const resendEmail = async () => {
    setResending(true);
    setResendMessage(null);

    try {
      await Axios.post("/auth/verify-email/resend");

      setResendMessage("Verification link sent! Check your email.");
    } catch (err: any) {
      setResendMessage(
        err?.response?.data?.detail ||
          "Failed to resend verification email. Try again later.",
      );
    } finally {
      setResending(false);
    }
  };

  const isSuccess = !!success;
  const isError = !!error;

  return (
    <div className="w-full">
      {/* ICON */}
      <div className="flex justify-center mb-6">
        {loading ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <BeatLoader size={8} />
          </div>
        ) : isSuccess ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <MailCheck className="h-7 w-7" />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>
        )}
      </div>

      {/* TEXT */}
      <div className="text-center">
        <h1 className="text-lg font-semibold text-slate-800">
          {loading && "Verifying your email..."}
          {isSuccess && "Email verified"}
          {isError && "Verification failed"}
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          {loading && "Please wait while we confirm your email address."}
          {isSuccess && "Your account is now verified."}
          {isError && "We couldn’t verify your email."}
        </p>
      </div>

      {/* SUCCESS ACTION */}
      {isSuccess && (
        <button
          onClick={() => router.push("/auth/login")}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
        >
          Continue
        </button>
      )}

      {/* ERROR ACTION */}
      {isError && (
        <div className="mt-6 space-y-3">
          <button
            onClick={resendEmail}
            disabled={resending}
            className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend verification email"}
          </button>

          {resendMessage && (
            <p className="text-sm text-center text-slate-600">
              {resendMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
