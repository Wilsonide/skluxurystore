"use client";

import { useEffect } from "react";

import { AuthService } from "../services/auth.service";
import { useAuthStore } from "../store/auth-store";

export function useAuthInit() {
  const startLoading = useAuthStore((state) => state.startLoading);

  const finishLoading = useAuthStore((state) => state.finishLoading);

  const setUser = useAuthStore((state) => state.setUser);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      startLoading();

      try {
        const refresh = await AuthService.refresh();

        if (!mounted) return;

        setAccessToken(refresh.access_token);

        const user = await AuthService.me();

        if (!mounted) return;

        setUser(user);
      } catch {
        if (!mounted) return;

        setUser(null);
        setAccessToken(null);
      } finally {
        if (!mounted) return;

        finishLoading();
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [startLoading, finishLoading, setUser, setAccessToken]);
}
