"use client";

import { Bell, Menu, UserCircle } from "lucide-react";
import { useAuthStore } from "@/app/store/auth-store";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-900">Administration</p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your online store
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
        >
          <Bell size={19} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 border-l pl-3">
          <UserCircle size={30} className="text-slate-400" />

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">
              {user?.name || user?.email || "Administrator"}
            </p>

            <p className="text-xs text-slate-500">{user?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
