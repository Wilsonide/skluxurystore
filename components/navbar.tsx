"use client";

import Link from "next/link";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Bookstore
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/books">Books</Link>

          <Link href="/authors">Authors</Link>

          <Link href="/categories">Categories</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          <Button>Login</Button>
        </div>
      </div>
    </header>
  );
}
