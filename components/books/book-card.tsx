"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { BookType } from "@/app/(public)/books/page";
import { useDispatch } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { showSuccess } from "@/lib/toast";

interface BookCardProps {
  book: BookType;
}

export default function BookCard({ book }: BookCardProps) {
  const dispatch = useDispatch();

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/books/${book.id}`}>
        <div className="overflow-hidden">
          <img
            src={book?.cover_image}
            alt={book.title}
            className="h-[340px] w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold">{book.title}</h3>

          <p className="mt-2 text-2xl font-bold">${book.price}</p>
        </div>

        <Button
          className="w-full"
          onClick={() =>
            dispatch(
              addToCart({
                id: book.id,
                title: book.title,
                price: book.price,
                image_url: book.cover_image,
              }),
            ) && showSuccess("Book added to cart!")
          }
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
}
