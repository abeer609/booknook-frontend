import { Suspense } from "react";
import HeroCarousel from "@/components/hero-carousel";
import BookSection from "@/components/book-section";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroCarousel />
      <Suspense fallback={<div className="px-4 py-8">Loading...</div>}>
        <BookSection />
      </Suspense>
    </main>
  );
}