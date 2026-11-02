"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenIcon,
  ChevronDownIcon,
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Academic",
  "Others",
] as const;

function SearchForm({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        router.push(q ? `/books?search=${encodeURIComponent(q)}` : "/books");
        onNavigate?.();
      }}
    >
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupButton
            type="submit"
            size="icon-xs"
            variant="ghost"
            aria-label="Search books"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
          aria-label="Search books"
        />
      </InputGroup>
    </form>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user;
  const initial = (user?.name ?? user?.email ?? "U").charAt(0).toUpperCase();

  const goToCategory = (category: string | null) => {
    router.push(
      category ? `/books?category=${encodeURIComponent(category)}` : "/books"
    );
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <BookOpenIcon aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight">
            BookHaven
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Button
            variant="ghost"
            render={<Link href="/books" />}
            nativeButton={false}
            data-active={pathname === "/books"}
            className="data-active:bg-muted"
          >
            All books
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" />}
            >
              Categories
              <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => goToCategory(null)}>
                  All Categories
                </DropdownMenuItem>
                {CATEGORIES.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => goToCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <SearchForm className="ml-auto hidden w-full max-w-xs md:flex" />

        <div className="hidden shrink-0 items-center gap-2 md:flex">
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
                <span
                  aria-hidden="true"
                  className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                >
                  {initial}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="max-w-48 truncate">
                    {user.name ?? user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserIcon />
                    Profile
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
                Sign in
              </Button>
              <Button render={<Link href="/sign-up" />} nativeButton={false}>
                Sign up
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
          !mobileOpen && "hidden"
        )}
      >
        <div className="flex flex-col gap-1">
          <SearchForm
            className="mb-2 w-full"
            onNavigate={() => setMobileOpen(false)}
          />
          <Button
            variant="ghost"
            className="justify-start"
            render={<Link href="/books" />}
            nativeButton={false}
            onClick={() => setMobileOpen(false)}
          >
            All books
          </Button>
          <p className="px-2.5 pt-2 text-xs font-medium text-muted-foreground">
            Categories
          </p>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className="justify-start font-normal"
              onClick={() => goToCategory(category)}
            >
              {category}
            </Button>
          ))}
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
                Profile
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
                Sign in
              </Button>
              <Button
                className="flex-1"
                render={<Link href="/sign-up" />}
                nativeButton={false}
                onClick={() => setMobileOpen(false)}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
