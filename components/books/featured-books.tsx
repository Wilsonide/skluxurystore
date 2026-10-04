import BookCard from "./book-card";

const books = [
  {
    id: 1,
    title: "Atomic Habits",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    price: 25,
  },
  {
    id: 2,
    title: "Deep Work",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    price: 18,
  },
  {
    id: 3,
    title: "The Psychology of Money",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    price: 20,
  },
  {
    id: 4,
    title: "48 Laws of Power",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    price: 30,
  },
];

export default function FeaturedBooks() {
  return (
    <section className="container mx-auto">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold">Featured Books</h2>

          <p className="mt-3 text-muted-foreground">
            Trending books readers love most
          </p>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
