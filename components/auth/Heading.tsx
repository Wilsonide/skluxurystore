import { cn } from "@/lib/utils";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-3 text-center">
      {/* Store Logo */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl font-bold text-white shadow-sm">
        S
      </div>

      {/* Store Name */}
      <h1 className={cn("text-2xl font-bold tracking-tight text-slate-900")}>
        Store
      </h1>

      {/* Page Description */}
      <p className="max-w-sm text-sm leading-5 text-slate-500">{label}</p>
    </div>
  );
};
