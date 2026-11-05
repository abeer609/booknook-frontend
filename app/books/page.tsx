import BookCard from "@/components/book-card";
import axiosClient from "@/lib/axios-client";
import { Spinner } from "@/components/ui/spinner";
import { Book } from "@/lib/types";
export const metadata = { title: "BookNook | All Books" };
export const instant = false;

async function getBooks(query: {
  [key: string]: string | undefined;
}): Promise<Book[]> {
  "use cache";
  const { data } = await axiosClient.get<Book[]>("/books", { params: query });
  return data;
}

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const BookList = async ({ searchParams }: Props) => {
  const queryParams = await searchParams;
  const books = await getBooks(queryParams);
  if (books.length == 0) {
    return (
      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xl ">কোন বই খুঁজে পাওয়া যায় নি</p>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-[#f7f5f0] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-xl font-medium text-foreground">সকল বই</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookList;
