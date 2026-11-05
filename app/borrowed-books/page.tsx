import { redirect } from "next/navigation";

export default function BorrowedBooksRedirect() {
  redirect("/my-borrows");
}