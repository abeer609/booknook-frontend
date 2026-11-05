"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axios-client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Academic", "Others"];

export default function AddBookPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [jwt, setJwt] = useState<string | undefined>(undefined);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Fiction",
    imageUrl: "",
    shortDescription: "",
    totalCopies: 1,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  useEffect(() => {
    authClient.token().then((t: any) => setJwt(t?.data?.token ?? t?.token));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast("Please sign in");
      router.push("/sign-in");
      return;
    }
    setSaving(true);
    try {
      await axiosClient.post(
        "/books",
        {
          ...form,
          addedBy: user.name,
          addedByEmail: user.email,
        },
        { headers: { Authorization: jwt ? `Bearer ${jwt}` : "" } }
      );
      toast("Book added successfully");
      router.push("/books");
    } catch (err: any) {
      toast(err?.response?.data?.error ?? "Failed to add book");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <p className="text-muted-foreground">Please sign in to add a book.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">Add Book</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Author Name</Label>
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
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Book Image (URL)</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
          <div className="flex flex-col gap-1">
            <Label>User Name</Label>
            <Input value={user.name ?? ""} readOnly />
          </div>
          <div className="flex flex-col gap-1">
            <Label>User Email</Label>
            <Input value={user.email ?? ""} readOnly />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </div>
    </main>
  );
}