"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductSearchProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function ProductSearch({
  value = "",
  onChange,
  placeholder = "Search products...",
  debounceMs = 400,
}: ProductSearchProps) {
  const [search, setSearch] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(search.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [search, debounceMs, onChange]);

  const clearSearch = () => {
    setSearch("");
    onChange("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {search && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
