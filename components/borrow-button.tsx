"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axios-client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BorrowButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [copies, setCopies] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axiosClient
      .get(`/books/${bookId}`)
      .then((res) => setCopies(res.data?.copies ?? res.data?.totalCopies ?? 1))
      .catch(() => setCopies(1));
  }, [bookId]);

  useEffect(() => {
    if (!user) return;
    axiosClient
      .get(`/borrows?borrowerEmail=${encodeURIComponent(user.email ?? "")}`)
      .then((res) => {
        const borrows = res.data as { bookId: string; status: string }[];
        setAlreadyBorrowed(
          borrows.some((b) => b.bookId === bookId && b.status === "borrowed")
        );
      })
      .catch(() => setAlreadyBorrowed(false));
  }, [user, bookId]);

  const notAvailable = copies !== null && copies <= 0;

  const handleConfirm = async () => {
    if (!user) {
      toast("Please sign in to borrow this book");
      router.push("/sign-in");
      return;
    }
    setLoading(true);
    try {
      const { data: tokenData } = await authClient.token();
      const token = (tokenData as any)?.token;
      await axiosClient.post(
        "/borrows",
        { bookId },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      setAlreadyBorrowed(true);
      setModalOpen(false);
      toast("Book borrowed successfully");
    } catch (err: any) {
      toast(err?.response?.data?.error ?? "Borrow failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!user) {
      toast("Please sign in to borrow this book");
      router.push("/sign-in");
      return;
    }
    if (alreadyBorrowed) {
      toast("You have already borrowed this book");
      return;
    }
    if (notAvailable) {
      toast("Not available");
      return;
    }
    setModalOpen(true);
  };

  return (
    <>
      <Button
        className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white"
        onClick={handleClick}
        disabled={loading || alreadyBorrowed || notAvailable}
      >
        {notAvailable
          ? "Not Available"
          : alreadyBorrowed
          ? "Already borrowed"
          : "বইটি ধার নিন"}
      </Button>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Confirm Borrow</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">User Name</label>
                <input
                  className="h-9 rounded-md border border-input bg-muted px-3 text-sm"
                  value={user?.name ?? ""}
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  className="h-9 rounded-md border border-input bg-muted px-3 text-sm"
                  value={user?.email ?? ""}
                  readOnly
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Borrow"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}