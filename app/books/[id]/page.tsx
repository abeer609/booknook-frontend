import { Suspense } from "react";
import BookDetails from "@/components/book-details";

async function Details({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookDetails id={id} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="px-4 py-10">Loading...</div>}>
      <Details params={params} />
    </Suspense>
  );
}