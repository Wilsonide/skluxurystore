/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CardWrapper } from "./card-wrapper";
import { resetSchema } from "@/schemas";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

import { Axios } from "@/lib/axios";

export const ResetForm = () => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof resetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const res = await Axios.post("/auth/reset", values);

        setError(res.data?.error);
        setSuccess(res.data?.message);
      } catch (err: any) {
        setError(err.response?.data?.detail || "No Server Response");
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonHref="/auth/login"
      backButtonLink="Back to Login"
      headerTitle="Reset your password"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* EMAIL FIELD */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="Enter your email address"
            disabled={isPending}
            {...form.register("email")}
          />

          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* ERROR / SUCCESS */}
        <FormError message={error} />
        <FormSuccess message={success} />

        {/* SUBMIT */}
        <Button className="w-full" type="submit" disabled={isPending}>
          Send reset email
        </Button>
      </form>
    </CardWrapper>
  );
};
