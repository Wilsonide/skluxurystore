import { AuthorType } from "@/app/(public)/author/page";

interface AuthorCardProps {
  author: AuthorType;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={author.image_url}
        alt={author.name}
        className="h-64 w-full rounded-xl object-cover"
      />

      <div className="mt-5">
        <h3 className="text-2xl font-semibold">{author.name}</h3>
      </div>
    </div>
  );
}
