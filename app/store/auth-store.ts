import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/app/services/auth.service";

interface AuthStore {
  user: User | null;
  accessToken: string | null;

  isLoading: boolean;
  hydrated: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;

  startLoading: () => void;
  finishLoading: () => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      isLoading: true,
      hydrated: false,

      setUser: (user) =>
        set({
          user,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),

      startLoading: () =>
        set({
          isLoading: true,
        }),

      finishLoading: () =>
        set({
          isLoading: false,
          hydrated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isLoading: false,
          hydrated: true,
        }),
    }),
    {
      name: "ecommerce-auth",
    },
  ),
);
