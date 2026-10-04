"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";

import { CardWrapper } from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";
import { loginSchema } from "@/schemas";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const from = searchParams.get("from");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await AuthService.login(values);

      /*
       * Backend returns:
       *
       * {
       *   id,
       *   email,
       *   user_name,
       *   name,
       *   role,
       *   is_verified,
       *   access_token
       * }
       *
       * There is NO `data.user`.
       */

      setAccessToken(data.access_token);
      setUser(data);

      setSuccess("Welcome back!");

      const role = data.role?.toUpperCase();

      const isAdmin =
        role === "ADMIN" || role === "SUPER_ADMIN" || role === "STORE_ADMIN";

      /*
       * Only allow internal redirects.
       */
      if (from && from.startsWith("/") && !from.startsWith("//")) {
        router.replace(from);
        return;
      }

      /*
       * Store administrators
       */
      if (isAdmin) {
        router.replace("/admin");
        return;
      }

      /*
       * Customers
       */
      router.replace("/");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      };

      const message =
        axiosError.response?.data?.detail ??
        axiosError.response?.data?.message ??
        "Unable to sign in. Please check your email and password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonLink="Create account"
      backButtonHref="/auth/register"
      headerTitle="Sign in"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Intro */}
        <div>
          <p className="text-sm text-slate-500">
            Sign in to continue shopping and manage your account.
          </p>
        </div>

        <div className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="h-11 pl-10"
                {...form.register("email")}
              />
            </div>

            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <Link
                href="/auth/reset"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                className="h-11 pl-10 pr-11"
                {...form.register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* ERROR */}
        <FormError message={error} />

        {/* SUCCESS */}
        <FormSuccess message={success} />

        {/* LOGIN */}
        <Button
          className="h-11 w-full rounded-xl text-sm font-semibold"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        {/* Register */}
        <p className="text-center text-sm text-slate-500">
          New to our store?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-slate-900 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </CardWrapper>
  );
};
