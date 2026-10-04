import Navbar from "./navbar";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto grid min-h-[85vh] items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight">
            Discover Your Next Favorite Book
          </h1>

          <p className="text-lg text-muted-foreground">
            Explore thousands of books from top authors around the world.
          </p>

          <div className="flex gap-4">
            <Button size="lg">Explore Books</Button>

            <Button size="lg" variant="outline">
              Best Sellers
            </Button>
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
            alt="Books"
            className="rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
