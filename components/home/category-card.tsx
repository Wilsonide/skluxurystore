import Link from "next/link";

interface CategoryCardProps {
  category: string;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href="/category/books">
      <div className="rounded-2xl border bg-muted/40 p-8 transition hover:-translate-y-1 hover:bg-black hover:text-white">
        <h3 className="text-2xl font-bold">{category}</h3>
      </div>
    </Link>
  );
}
