"use client";

import { useState } from "react";
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

  const handleBorrow = async () => {
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
        { bookId, status: "borrowed" },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } },
      );
      toast("Book borrowed successfully");
    } catch (err: any) {
      toast(err?.response?.data?.error ?? "Borrow failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white"
      onClick={handleBorrow}
      disabled={loading}
    >
      {loading ? "Processing..." : "বইটি ধার নিন"}
    </Button>
  );
}
