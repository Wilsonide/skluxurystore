/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CardWrapper } from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

import { AuthService } from "@/app/services/auth.service";
import { newPasswordSchema } from "@/schemas";

export const NewPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof newPasswordSchema>) => {
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    try {
      setLoading(true);

      const response = await AuthService.confirmPasswordReset({
        token,
        new_password: values.password,
      });

      setSuccess(
        response?.message || "Password reset successful. You can now log in.",
      );

      // Optional: send the customer back to login
      setTimeout(() => {
        router.replace("/auth/login");
      }, 2000);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        "Unable to reset password. The reset link may have expired.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Create a new password"
      backButtonLabel="Back to login"
      backButtonLink="Login"
      backButtonHref="/auth/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* PASSWORD */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-900"
            >
              New Password
            </label>

            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              disabled={loading}
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-900"
            >
              Confirm Password
            </label>

            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              autoComplete="new-password"
              disabled={loading}
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button
          className="w-full rounded-xl py-3 text-lg font-semibold"
          type="submit"
          disabled={loading || !token}
        >
          {loading ? "Resetting password..." : "Reset Password"}
        </Button>
      </form>
    </CardWrapper>
  );
};
