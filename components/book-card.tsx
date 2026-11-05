import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Book } from "@/lib/types";

function BookCard({ book }: { book: Book }) {
  return (
    <Card className="rounded-md border bg-card p-3 shadow-sm">
      <Link href={`/books/${book._id}`} className="">
        <CardContent className="flex flex-col gap-3 p-0">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="mb-3 h-[260px] w-full object-cover"
          />

          <p className="text-left font-semibold">{book.title}</p>

          <p className="w-full text-left text-xs text-muted-foreground">
            {book.author}
          </p>
          <p className="w-full text-left text-xs text-muted-foreground">
            {book.category}
          </p>

          <span className="text-sm text-primary">View Details</span>
        </CardContent>
      </Link>
    </Card>
  );
}
export default BookCard;
