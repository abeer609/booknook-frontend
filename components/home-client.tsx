"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosClient from "@/lib/axios-client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  createdAt?: string;
};

const slides = [
  "https://wafilife-media-backend.wafilife.com/2026/06/desktop%20(26)-mqc5jj0k-us21.jpg",
  "https://wafilife-media-backend.wafilife.com/2026/07/Desktop%20(35)-mr7srtak-gzz8.jpg",
  "https://wafilife-media-backend.wafilife.com/2026/06/desktop%20(26)-mqc5jj0k-us21.jpg",
];

export default function HomeClient() {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);

  useEffect(() => {
    document.title = "BookNook | Home";
  }, []);

  useEffect(() => {
    axiosClient
      .get<Book[]>("/books")
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });
        setNewArrivals(sorted.slice(0, 6));
      })
      .catch(() => setNewArrivals([]));
  }, []);

  return (
    <main className="flex flex-1 flex-col">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="w-full"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full overflow-hidden bg-muted max-h-92.5">
              <img src={src} alt="Banner" className="w-full h-auto" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Link href="/books">
                  <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                    Browse Books
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">New Arrivals</h2>
            <Link href="/books" className="text-sm text-primary underline">
              See All Books
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
            {newArrivals.map((book) => (
              <div
                key={book._id}
                className="flex flex-col rounded-md border bg-card p-3 shadow-sm"
              >
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="mb-3 h-[260px] w-full object-cover"
                />
                <h3 className="text-base font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="text-xs text-muted-foreground">{book.category}</p>
                <div className="mt-auto pt-3">
                  <Link href={`/books/${book._id}`}>
                    <button className="rounded-md border px-3 py-1 text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-xl font-bold">How Borrowing Works</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-md border bg-card p-4">
              <h3 className="font-semibold">1. Browse</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Find a book you like from our collection.
              </p>
            </div>
            <div className="rounded-md border bg-card p-4">
              <h3 className="font-semibold">2. Borrow</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click borrow and confirm. The book is yours for 7 days.
              </p>
            </div>
            <div className="rounded-md border bg-card p-4">
              <h3 className="font-semibold">3. Return</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Return the book from My Borrows when done.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-xl font-bold">Top Categories</h2>
          <div className="flex flex-wrap gap-2">
            {["Fiction", "Science", "History", "Kids", "Academic", "Others"].map(
              (c) => (
                <Link
                  key={c}
                  href={`/books?category=${c}`}
                  className="rounded-full border px-4 py-2 text-sm hover:bg-muted"
                >
                  {c}
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}