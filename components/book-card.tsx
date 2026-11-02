import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Book } from "@/lib/types";

function BookCard({ book }: { book: Book }) {
  return (
    <Card className="rounded-md shadow-sm">
      <Link
        href={`/books/${book._id}`}
        className="w-full text-left text-sm leading-snug text-foreground hover:underline"
      >
        <CardContent className="flex flex-col items-center gap-3 p-3">
          <div className="flex h-62 w-41.25 items-center justify-center overflow-hidden bg-muted">
            <img
              src={book.imageUrl}
              alt={book.title}
              width={165}
              height={248}
              className="h-62 w-41.25 object-cover"
            />
          </div>

          {book.title}

          <p className="w-full text-left text-xs text-muted-foreground">
            {book.author}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
export default BookCard;
