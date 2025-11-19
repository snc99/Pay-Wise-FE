"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/side-bar/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Backend akan cek cookie pw_token otomatis
    (async () => {
      try {
        const data = await apiFetch("/auth/me", {
          method: "GET",
        });

        if (data?.success && data?.user) {
          setUser(data.user);
        } else {
          // Jika response tidak ada user, redirect ke login
          router.replace("/auth/login");
        }
      } catch (err) {
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Jika user null setelah loading, jangan render apapun
  // (user akan di-redirect ke login di useEffect)
  if (!user) {
    return null;
  }

  const isSuperAdmin =
    Boolean(user) &&
    (String(user?.role).toLowerCase() === "superadmin" ||
      (Array.isArray(user?.roles) && user.roles.includes("superadmin")));

  return (
    <SidebarProvider>
      <AppSidebar user={user} isSuperAdmin={isSuperAdmin} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
