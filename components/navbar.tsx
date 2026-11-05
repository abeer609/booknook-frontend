"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user;
  const initial = (user?.name ?? user?.email ?? "U").charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const privateLinks = [
    { href: "/add-book", label: "Add Book" },
    { href: "/my-books", label: "My Books" },
    { href: "/my-borrows", label: "My Borrows" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <BookOpenIcon aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight">BookNook</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Button
            variant="ghost"
            render={<Link href="/" />}
            nativeButton={false}
            data-active={pathname === "/"}
            className="data-active:bg-muted"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            render={<Link href="/books" />}
            nativeButton={false}
            data-active={pathname === "/books"}
            className="data-active:bg-muted"
          >
            All Books
          </Button>
          {user
            ? privateLinks.map((l) => (
                <Button
                  key={l.href}
                  variant="ghost"
                  render={<Link href={l.href} />}
                  nativeButton={false}
                  data-active={pathname === l.href}
                  className="data-active:bg-muted"
                >
                  {l.label}
                </Button>
              ))
            : null}
        </div>

        <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Account menu"
                  />
                }
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name ?? "user"}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {initial}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="max-w-48 truncate">
                    {user.name ?? user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserIcon />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleSignOut}
                    disabled={signingOut}
                  >
                    <LogOutIcon />
                    {signingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                render={<Link href="/sign-in" />}
                nativeButton={false}
              >
                Login
              </Button>
              <Button render={<Link href="/sign-up" />} nativeButton={false}>
                Register
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </nav>

      <div
        className={cn(
          "border-t px-4 pt-3 pb-4 md:hidden",
          !mobileOpen && "hidden",
        )}
      >
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-start"
            render={<Link href="/" />}
            nativeButton={false}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            render={<Link href="/books" />}
            nativeButton={false}
            onClick={() => setMobileOpen(false)}
          >
            All Books
          </Button>
          {user
            ? privateLinks.map((l) => (
                <Button
                  key={l.href}
                  variant="ghost"
                  className="justify-start"
                  render={<Link href={l.href} />}
                  nativeButton={false}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Button>
              ))
            : null}
          {user ? (
            <>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/profile");
                }}
              >
                <UserIcon data-icon="inline-start" />
                My Profile
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-destructive"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                <LogOutIcon data-icon="inline-start" />
                {signingOut ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                render={<Link href="/sign-in" />}
                nativeButton={false}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Button>
              <Button
                className="flex-1"
                render={<Link href="/sign-up" />}
                nativeButton={false}
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
