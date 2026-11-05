"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState(2025);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpenIcon aria-hidden="true" />
              <span className="text-lg font-semibold tracking-tight">BookNook</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A small online library. Add a book, borrow a book, return a book.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Email: support@booknook.com
            </p>
            <p className="text-sm text-muted-foreground">Phone: +880 1234 567890</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Follow Us</h3>
            <div className="mt-2 flex gap-3 text-sm text-muted-foreground">
              <Link href="#" className="hover:underline">
                Facebook
              </Link>
              <Link href="#" className="hover:underline">
                Twitter
              </Link>
              <Link href="#" className="hover:underline">
                Instagram
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
          © {year} BookNook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}