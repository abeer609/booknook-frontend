"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosClient from "@/lib/axios-client";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type Borrow = {
  _id: string;
  bookId: string;
  borrower: string;
  status: "borrowed" | "returned";
  borrowedAt: string;
  returnDate?: string;
  bookTitle?: string;
  bookImage?: string;
};

type Book = {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
};

export default function MyBorrowsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState<string | null>(null);

  useEffect(() => {
    document.title = "BookNook | My Borrows";
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      axiosClient.get<Borrow[]>(
        `/borrows?borrowerEmail=${encodeURIComponent(user.email ?? "")}`
      ),
      axiosClient.get<Book[]>("/books"),
    ])
      .then(([bRes, bookRes]) => {
        setBorrows(bRes.data);
        setBooks(bookRes.data);
      })
      .catch(() => {
        setBorrows([]);
        setBooks([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const bookMap = new Map(books.map((b) => [b._id, b]));

  const handleReturn = async (id: string) => {
    setReturning(id);
    try {
      const { data: tokenData } = await authClient.token();
      const token = (tokenData as any)?.token ?? (tokenData as any)?.data?.token;
      await axiosClient.delete(`/borrows/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setBorrows((prev) => prev.filter((b) => b._id !== id));
      toast("Book returned");
    } catch {
      toast("Return failed");
    } finally {
      setReturning(null);
    }
  };

  if (!user) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <p className="text-muted-foreground">
          Please{" "}
          <Link href="/sign-in" className="text-primary underline">
            sign in
          </Link>{" "}
          to view your borrowed books.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold">My Borrows</h1>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner /> Loading...
          </div>
        ) : borrows.length === 0 ? (
          <p className="text-muted-foreground">You have no borrowed books.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left">Image</th>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Borrow Date</th>
                  <th className="px-3 py-2 text-left">Return Date</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((b) => {
                  const book = bookMap.get(b.bookId);
                  return (
                    <tr key={b._id} className="border-t">
                      <td className="px-3 py-2">
                        <img
                          src={book?.imageUrl ?? b.bookImage ?? ""}
                          alt={book?.title ?? "Book"}
                          className="h-12 w-8 object-cover"
                        />
                      </td>
                      <td className="px-3 py-2">{book?.title ?? b.bookTitle}</td>
                      <td className="px-3 py-2">
                        {b.borrowedAt
                          ? new Date(b.borrowedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {b.returnDate
                          ? new Date(b.returnDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReturn(b._id)}
                          disabled={returning === b._id}
                        >
                          {returning === b._id ? (
                            <Spinner className="size-4" />
                          ) : (
                            "Return Book"
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}