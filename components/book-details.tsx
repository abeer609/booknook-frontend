import Link from "next/link";
import { connection } from "next/server";
import axiosClient from "@/lib/axios-client";
import { Card, CardContent } from "@/components/ui/card";

type Book = {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  shortDescription?: string;
  category?: string;
};

async function getBook(id: string): Promise<Book | null> {
  await connection();
  try {
    const { data } = await axiosClient.get<Book>(`/books/${id}`);
    return data;
  } catch {
    return null;
  }
}

async function getAllBooks(): Promise<Book[]> {
  try {
    const { data } = await axiosClient.get<Book[]>("/books");
    return data;
  } catch {
    return [];
  }
}

export default async function BookDetails({ id }: { id: string }) {
  const book = await getBook(id);
  const allBooks = await getAllBooks();
  const related = allBooks.filter((b) => b._id !== id).slice(0, 3);

  if (!book) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 text-center text-muted-foreground">
        Book not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* breadcrumb */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[35%_40%_25%]">
        {/* left: cover */}
        <div className="flex justify-center">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="h-auto w-full max-w-[320px] object-contain"
          />
        </div>

        {/* center: details */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-[#1a2b4c]">{book.title}</h1>
          <div className="flex flex-col gap-1 text-sm">
            <p>
              <span className="font-semibold text-red-600">লেখক :</span>{" "}
              <span className="text-gray-700">{book.author}</span>
            </p>
            <p>
              <span className="font-semibold text-red-600">প্রকাশনী :</span>{" "}
              <span className="text-gray-700">—</span>
            </p>
            <p>
              <span className="font-semibold text-red-600">বিষয় :</span>{" "}
              <span className="text-gray-700">{book.category ?? "—"}</span>
            </p>
            <p>
              <span className="font-semibold text-red-600">পৃষ্ঠা :</span>{" "}
              <span className="text-gray-700">—</span>
            </p>
          </div>

          <p className="text-sm leading-relaxed text-gray-700">
            {book.shortDescription ?? ""}
            {book.shortDescription ? (
              <Link href="#" className="ml-1 font-semibold text-red-600">
                আরো পড়ুন
              </Link>
            ) : null}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">৳ ২২১</span>
            <span className="text-sm text-gray-400 line-through">৳ ৩৪০</span>
            <span className="text-sm font-semibold text-red-600">
              (৩৫% ছাড়ে)
            </span>
          </div>

          <div className="flex gap-3">
            <button className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white">
              অর্ডার করুন
            </button>
            <button className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white">
              কার্টে যোগ করুন
            </button>
          </div>

          <div className="flex gap-4 text-sm text-gray-600">
            <button className="flex items-center gap-1">
              <span>♡</span> Wishlist
            </button>
            <button className="flex items-center gap-1">
              <span>↗</span> বন্ধুদের সাথে শেয়ার করুন
            </button>
          </div>
        </div>

        {/* right: related */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">আরো দেখুন...</span>
            <Link
              href="/books"
              className="text-sm font-semibold text-red-600 underline"
            >
              সবগুলো দেখুন
            </Link>
          </div>
          {related.map((b) => (
            <Card key={b._id} className="rounded-md shadow-sm">
              <CardContent className="flex gap-3 p-3">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="h-20 w-14 shrink-0 object-cover"
                />
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/book/${b._id}`}
                    className="text-sm font-semibold text-gray-800 hover:underline"
                  >
                    {b.title}
                  </Link>
                  <p className="text-xs text-gray-500">{b.author}</p>
                  <div className="flex items-baseline gap-1 text-xs">
                    <span className="font-bold text-red-600">৳ ২৭৫</span>
                    <span className="text-gray-400 line-through">৳ ৫০০</span>
                    <span className="text-red-600">(৪৫% ছাড়ে)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
