"use client";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { authClient } from "@/lib/auth-client";
import { forbidden } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = authClient.getSession().then(({ data }) => {
  //   console.log(data?.user.role);
  //   if (data?.user.role != "admin") {
  //     forbidden();
  //   }
  // });

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
