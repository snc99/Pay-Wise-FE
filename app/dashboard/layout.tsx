"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/side-bar/app-sidebar";
import type { AuthUser } from "@/lib/types/auth";
import type { Role } from "@/lib/types/role";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, authChecked, finishLogin, isLoggingIn } = useAuth();

  // 🔐 AUTH GUARDED
  useEffect(() => {
    if (!authChecked && !user) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, authChecked, router]);

  // 🔄 Sinkronisasi loader login → auth ready
  useEffect(() => {
    if (!isLoading && user && isLoggingIn) {
      finishLogin();
    }
  }, [user, isLoading, isLoggingIn, finishLogin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isSuperAdmin = user?.role === "SUPERADMIN";
  const authUser: AuthUser = {
    ...user,
    role: user.role as Role,
  };

  return (
    <SidebarProvider>
      <AppSidebar user={authUser} isSuperAdmin={isSuperAdmin} />
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
