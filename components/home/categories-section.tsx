import CategoryCard from "@/components/home/category-card";

const categories = [
  "Business",
  "Technology",
  "Finance",
  "Programming",
  "History",
  "Self Growth",
];

export default function CategoriesSection() {
  return (
    <section className="container mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-bold">Browse Categories</h2>

        <p className="mt-3 text-muted-foreground">Find books by category</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category} category={category} />
        ))}
      </div>
    </section>
  );
}
