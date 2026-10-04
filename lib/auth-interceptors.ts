/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/app/store/auth-store";
import { AuthService } from "@/app/services/auth.service";
import { Axios } from "./axios";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export function setupAuthInterceptor() {
  // Prevent registering the interceptors multiple times.
  if ((Axios as any).__authInterceptorInstalled) {
    return;
  }

  (Axios as any).__authInterceptorInstalled = true;

  // ============================================================
  // REQUEST
  // ============================================================

  Axios.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // ============================================================
  // RESPONSE
  // ============================================================

  Axios.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const original = error.config as RetryConfig | undefined;

      if (!original) {
        return Promise.reject(error);
      }

      // Never intercept refresh itself.
      if (original.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // Only handle 401.
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // Prevent infinite retries.
      if (original._retry) {
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = AuthService.refresh()
            .then((result) => {
              useAuthStore.getState().setAccessToken(result.access_token);

              return result.access_token;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        original.headers.Authorization = `Bearer ${newToken}`;

        return Axios(original);
      } catch (refreshError) {
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    },
  );
}
