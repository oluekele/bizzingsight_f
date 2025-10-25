"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   console.log(
  //     "DashboardLayout isAuthenticated:",
  //     isAuthenticated,
  //     "userRole:",
  //     userRole,
  //     "token:",
  //     localStorage.getItem("access_token")
  //   ); // Debug
  //   if (!isAuthenticated) router.push("/");
  // }, [isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   console.log("Not authenticated, returning null"); // Debug
  //   return null;
  // }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
