"use client";

import { useEffect } from "react";

import { setupAuthInterceptor } from "@/lib/auth-interceptors";
import { useAuthInit } from "../hooks/use-auth-init";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    setupAuthInterceptor();
  }, []);

  useAuthInit();

  return <>{children}</>;
}
