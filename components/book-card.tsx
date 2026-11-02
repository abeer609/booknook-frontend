import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Book } from "@/lib/types";

function BookCard({ book }: { book: Book }) {
  return (
    <Card className="rounded-md shadow-sm">
      <Link href={`/books/${book._id}`} className="">
        <CardContent className="flex flex-col gap-3 p-3">
          <div className="flex h-62 w-full items-center justify-center overflow-hidden bg-muted">
            <img
              src={book.imageUrl}
              alt={book.title}
              width={165}
              height={248}
              className="h-62 w-41.25 object-cover"
            />
          </div>

          <p className="text-left">{book.title}</p>

          <p className="w-full text-left text-xs text-muted-foreground">
            {book.author}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
export default BookCard;
