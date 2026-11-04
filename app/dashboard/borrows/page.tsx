"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type Borrow = {
  _id: string;
  bookId: string;
  borrower: string;
  status: "borrowed" | "returned";
  borrowedAt: string;
};

const emptyForm = {
  bookId: "",
  borrower: "",
  status: "borrowed" as "borrowed" | "returned",
};

export default function DashboardBorrowsPage() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Borrow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get<Borrow[]>("/borrows");
      setBorrows(data);
    } catch {
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (b: Borrow) => {
    setEditing(b);
    setForm({
      bookId: b.bookId,
      borrower: b.borrower,
      status: b.status,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const token = await authClient.token();

      if (editing) {
        const { data } = await axiosClient.patch<Borrow>(
          `/borrows/${editing._id}`,
          form,
          {
            headers: {
              Authorization: token.data?.token,
            },
          },
        );
        setBorrows((prev) =>
          prev.map((b) => (b._id === editing._id ? data : b)),
        );
      } else {
        const { data } = await axiosClient.post<Borrow>("/borrows", form, {
          headers: {
            Authorization: token.data?.token,
          },
        });
        setBorrows((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this borrow?")) return;
    try {
      await axiosClient.delete(`/borrows/${id}`);
      setBorrows((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast("Delete failed");
    }
  };

  const totalPages = Math.max(1, Math.ceil(borrows.length / pageSize));
  const paged = borrows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Borrows</h1>
        <Button onClick={openCreate}>Add Borrow</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left">Book ID</th>
                  <th className="px-3 py-2 text-left">Borrower</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Borrowed At</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="px-3 py-2">{b.bookId}</td>
                    <td className="px-3 py-2">{b.borrower}</td>
                    <td className="px-3 py-2">{b.status}</td>
                    <td className="px-3 py-2">
                      {b.borrowedAt
                        ? new Date(b.borrowedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(b)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(b._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center text-muted-foreground"
                    >
                      No borrows found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              {editing ? "Edit Borrow" : "Add Borrow"}
            </h2>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label>Book ID</Label>
                <Input
                  value={form.bookId}
                  onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Borrower</Label>
                <Input
                  value={form.borrower}
                  onChange={(e) =>
                    setForm({ ...form, borrower: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Status</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as "borrowed" | "returned",
                    })
                  }
                >
                  <option value="borrowed">borrowed</option>
                  <option value="returned">returned</option>
                </select>
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
    </div>
  );
}
