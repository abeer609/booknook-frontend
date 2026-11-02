import Link from "next/link";
import { connection } from "next/server";
import axiosClient from "@/lib/axios-client";
import { Book } from "@/lib/types";
import BookCard from "./book-card";

async function getBooks(): Promise<Book[]> {
  await connection();
  const { data } = await axiosClient.get<Book[]>("/books");
  return data;
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
