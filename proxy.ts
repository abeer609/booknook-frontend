import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const adminRequired = ["/dashboard/books", "/dashboard/borrows"];

const privateRoutes = [
  "/profile",
  "/add-book",
  "/my-books",
  "/my-borrows",
  "/borrowed-books",
];

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { pathname } = request.nextUrl;

  const isPrivate =
    privateRoutes.some((r) => pathname === r || pathname.startsWith(r + "/")) ||
    pathname.startsWith("/books/");

  if (isPrivate && !session) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (adminRequired.includes(pathname) && session?.user?.role != "admin") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/add-book",
    "/my-books",
    "/my-borrows",
    "/borrowed-books",
    "/books/:path*",
    "/dashboard/:path*",
  ],
};