import BookCard from "@/components/book-card";
import axiosClient from "@/lib/axios-client";
import { Book } from "@/lib/types";

async function getBooks(): Promise<Book[]> {
  "use cache";
  const { data } = await axiosClient.get<Book[]>("/books");
  return data;
}

const BookList = async () => {
  const books = await getBooks();
  return (
    <section className="bg-[#f7f5f0] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-xl font-medium text-foreground">সকল বই</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookList;
