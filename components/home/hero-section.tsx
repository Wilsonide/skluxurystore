import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto grid min-h-[85vh] items-center gap-16 py-20 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border px-4 py-2 text-sm font-medium">
            📚 Discover Your Next Favorite Book
          </div>

          <h1 className="text-6xl font-bold leading-tight tracking-tight">
            Read Better.
            <br />
            Learn Faster.
            <br />
            Grow Daily.
          </h1>

          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Explore thousands of books from bestselling authors across business,
            technology, self-growth, finance, and more.
          </p>

          <div className="flex gap-4">
            <Button size="lg">Explore Books</Button>

            <Button size="lg" variant="outline">
              Best Sellers
            </Button>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
            alt="Books"
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
