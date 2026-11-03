import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const adminRequired = ["/dashboard/books", "/dashboard/borrows"];

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { pathname } = request.nextUrl;

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (adminRequired.includes(pathname) && session.user.role != "admin") {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/dashboard/:path*"], // Specify the routes the middleware applies to
};
