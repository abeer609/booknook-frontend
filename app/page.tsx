import { Suspense } from "react";
import HomeClient from "@/components/home-client";

export default function Home() {
  return (
    <Suspense fallback={<div className="px-4 py-8">Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}