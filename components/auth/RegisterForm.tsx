/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CardWrapper } from "./card-wrapper";
import { registerSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { AuthService } from "@/app/services/auth.service";

export const RegisterForm = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      user_name: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await AuthService.register({
          name: values.name,
          email: values.email,
          user_name: values.user_name,
          password: values.password,
        });

        setSuccess(
          response?.message ??
            "Account created successfully! Redirecting to login...",
        );

        // Give the user a moment to see the success message,
        // then redirect to the login page.
        setTimeout(() => {
          router.push("/auth/login");
        }, 1200);
      } catch (err: any) {
        setError(
          err?.response?.data?.detail ??
            err?.response?.data?.message ??
            "Unable to create your account.",
        );
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      backButtonLink="Login"
      headerTitle="Register here"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* NAME */}
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-900"
            >
              Full Name
            </label>

            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={isPending}
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* USERNAME */}
          <div className="space-y-1">
            <label
              htmlFor="user_name"
              className="text-sm font-medium text-slate-900"
            >
              Username
            </label>

            <Input
              id="user_name"
              type="text"
              placeholder="Choose a username"
              autoComplete="username"
              disabled={isPending}
              {...form.register("user_name")}
            />

            {form.formState.errors.user_name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.user_name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-900"
            >
              Email
            </label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isPending}
              {...form.register("email")}
            />

            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-900"
            >
              Password
            </label>

            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={isPending}
              {...form.register("password")}
            />

            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button
          className="w-full rounded-xl"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </CardWrapper>
  );
};
