"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/app/store/auth-store";
import { AuthService } from "@/app/services/auth.service";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronsLeftRight,
  LogOut,
  User,
  ShoppingBag,
  Settings,
} from "lucide-react";

const UserItem = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

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
      // Clear Zustand authentication state
      logoutStore();

      router.replace("/");
    }
  };

  // ============================================================
  // INITIALS
  // ============================================================

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // ============================================================
  // ADMIN
  // ============================================================

  const isAdmin =
    user.role === "ADMIN" ||
    user.role === "SUPER_ADMIN" ||
    user.role === "STORE_ADMIN";

  return (
    <DropdownMenu>
      {/* ========================================================
          TRIGGER
      ======================================================== */}

      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex w-full cursor-pointer items-center p-5 text-sm transition hover:bg-primary/5"
        >
          <div className="flex max-w-[150px] items-center gap-x-2">
            <Avatar className="mr-2 h-8 w-8">
              {/* 
                Your current User interface does not contain
                profile, so this is intentionally omitted.
              */}

              <AvatarImage src="" alt={user.name} />

              <AvatarFallback className="bg-sky-500">{initials}</AvatarFallback>
            </Avatar>

            <span className="line-clamp-1 text-start font-medium">
              {user.name}&apos;s Account
            </span>
          </div>

          <ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>

      {/* ========================================================
          DROPDOWN
      ======================================================== */}

      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        {/* USER INFORMATION */}

        <div className="flex flex-col space-y-4 p-3">
          <div>
            <p className="text-xs font-medium leading-none text-muted-foreground">
              {user.email}
            </p>

            <p className="mt-1 text-[11px] uppercase text-muted-foreground">
              {user.role}
            </p>
          </div>

          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sky-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-medium">
                {user.name}&apos;s Account
              </p>

              <p className="line-clamp-1 text-xs text-muted-foreground">
                @{user.user_name}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* ACCOUNT */}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/account")}
        >
          <User className="mr-3 h-4 w-4" />
          My Account
        </DropdownMenuItem>

        {/* ORDERS */}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/account/orders")}
        >
          <ShoppingBag className="mr-3 h-4 w-4" />
          My Orders
        </DropdownMenuItem>

        {/* ADMIN */}

        {isAdmin && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/admin")}
            >
              <Settings className="mr-3 h-4 w-4" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        {/* LOGOUT */}

        <DropdownMenuItem
          disabled={loading}
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-3 h-4 w-4" />

          {loading ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserItem;
