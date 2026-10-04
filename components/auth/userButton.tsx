"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback } from "../ui/avatar";

import { User, LogOut, LogIn, ShoppingBag, Settings } from "lucide-react";

import { useAuthStore } from "@/app/store/auth-store";
import { AuthService } from "@/app/services/auth.service";

export const UserButton = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      setLoading(true);

      await AuthService.logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Always clear frontend authentication state
      logoutStore();

      setOpen(false);

      router.replace("/");
    }
  };

  // ============================================================
  // LOGIN
  // ============================================================

  if (!user) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center rounded-full transition hover:scale-105 focus:outline-none"
            aria-label="Account"
          >
            <Avatar className="h-9 w-9 border border-slate-200 bg-white">
              <AvatarFallback className="bg-gradient-to-br from-slate-900 to-slate-700 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
          align="end"
        >
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-700 focus:bg-slate-100"
            onClick={() => {
              setOpen(false);
              router.push("/auth/login");
            }}
          >
            <LogIn className="h-4 w-4" />

            <div>
              <p className="font-medium">Login</p>
              <p className="text-xs text-slate-500">Sign in to your account</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-700 focus:bg-slate-100"
            onClick={() => {
              setOpen(false);
              router.push("/auth/register");
            }}
          >
            <User className="h-4 w-4" />

            <div>
              <p className="font-medium">Create account</p>
              <p className="text-xs text-slate-500">Register a new account</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // ============================================================
  // LOGGED IN
  // ============================================================

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const isAdmin =
    user.role === "ADMIN" ||
    user.role === "SUPER_ADMIN" ||
    user.role === "STORE_ADMIN";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* ========================================================
          TRIGGER
      ======================================================== */}

      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center rounded-full transition hover:scale-105 focus:outline-none"
          aria-label="Account menu"
        >
          <Avatar className="h-9 w-9 border border-slate-200 bg-white">
            <AvatarFallback className="bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      {/* ========================================================
          DROPDOWN
      ======================================================== */}

      <DropdownMenuContent
        className="w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
        align="end"
      >
        {/* USER INFORMATION */}

        <DropdownMenuItem className="flex items-center gap-3 rounded-lg px-3 py-3 focus:bg-slate-50">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-slate-900 text-sm font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.name}
            </p>

            <p className="truncate text-xs text-slate-500">{user.email}</p>

            <p className="mt-0.5 text-[11px] font-medium uppercase text-slate-400">
              {user.role}
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* ACCOUNT */}

        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-slate-100"
          onClick={() => {
            setOpen(false);
            router.push("/account");
          }}
        >
          <User className="h-4 w-4" />
          Account
        </DropdownMenuItem>

        {/* ORDERS */}

        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-slate-100"
          onClick={() => {
            setOpen(false);
            router.push("/account/orders");
          }}
        >
          <ShoppingBag className="h-4 w-4" />
          My Orders
        </DropdownMenuItem>

        {/* ADMIN */}

        {isAdmin && (
          <>
            <DropdownMenuSeparator className="my-2 bg-slate-100" />

            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:bg-slate-100"
              onClick={() => {
                setOpen(false);
                router.push("/admin");
              }}
            >
              <Settings className="h-4 w-4" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        {/* LOGOUT */}

        <DropdownMenuItem
          disabled={loading}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />

          {loading ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
