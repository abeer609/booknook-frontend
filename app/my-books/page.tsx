"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axios-client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  shortDescription: string;
  totalCopies?: number;
  copies?: number;
  addedBy?: string;
  addedByEmail?: string;
};

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Academic", "Others"];

const emptyForm = {
  title: "",
  author: "",
  category: "Fiction",
  imageUrl: "",
  shortDescription: "",
  totalCopies: 1,
};

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);

  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  useEffect(() => {
    authClient.token().then((t: any) => setJwt(t?.data?.token ?? t?.token));
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get<Book[]>("/books");
      const mine = data.filter(
        (b) => b.addedByEmail === user?.email || b.addedBy === user?.name
      );
      setBooks(mine);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBooks();
  }, [user]);

  const openEdit = (book: Book) => {
    setEditing(book);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      imageUrl: book.imageUrl,
      shortDescription: book.shortDescription,
      totalCopies: book.totalCopies ?? 1,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setError("");
    setSaving(true);
    try {
      const { data } = await axiosClient.patch<Book>(
        `/books/${editing._id}`,
        form,
        { headers: { Authorization: jwt ? `Bearer ${jwt}` : "" } }
      );
      setBooks((prev) =>
        prev.map((b) => (b._id === editing._id ? data : b))
      );
      setModalOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axiosClient.delete(`/books/${deleteTarget._id}`, {
        headers: { Authorization: jwt ? `Bearer ${jwt}` : "" },
      });
      setBooks((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast("Book deleted");
    } catch {
      toast("Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (!user) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <p className="text-muted-foreground">Please sign in.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold">My Books</h1>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner /> Loading...
          </div>
        ) : books.length === 0 ? (
          <p className="text-muted-foreground">You have no books.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Author</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="border-t">
                    <td className="px-3 py-2">{book.title}</td>
                    <td className="px-3 py-2">{book.author}</td>
                    <td className="px-3 py-2">{book.category}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(book)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteTarget(book)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Edit Book</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Category</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Image URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Short Description</Label>
                <Textarea
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({ ...form, shortDescription: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Total Copies</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.totalCopies}
                  onChange={(e) =>
                    setForm({ ...form, totalCopies: Number(e.target.value) })
                  }
                  required
                />
              </div>
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">Confirm Delete</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Delete &quot;{deleteTarget.title}&quot;?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}