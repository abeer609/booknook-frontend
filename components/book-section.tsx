import Link from "next/link";
import { connection } from "next/server";
import axiosClient from "@/lib/axios-client";
import { Card, CardContent } from "@/components/ui/card";

type Book = {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
};

async function getBooks(): Promise<Book[]> {
  await connection();
  const { data } = await axiosClient.get<Book[]>("/books");
  return data;
}

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

export default async function BookSection() {
  const books = await getBooks();

  return (
    <section className="bg-[#f7f5f0] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-xl font-medium text-foreground">
          নতুন সংযোজিত বই
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
