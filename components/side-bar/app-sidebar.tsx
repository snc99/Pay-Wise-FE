"use client";

import * as React from "react";
import {
  BookOpen,
  CreditCard,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react";

import { NavMain } from "@/components/side-bar/nav-main";
import { NavUser } from "@/components/side-bar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AuthUser } from "@/lib/types/auth";

export function AppSidebar({
  user,
  isSuperAdmin = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: AuthUser | null;
  isSuperAdmin?: boolean;
}) {
  const pathname = usePathname();

  const userData = {
    name: user?.name || "Admin",
    username: user?.username || "admin",
    email: user?.email || "admin@example.com",
    avatar: "/avatar.png",
  };

  const fiturItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Pengguna",
      url: "/dashboard/user",
      icon: User,
      isActive: pathname.startsWith("/dashboard/user"),
    },
    {
      title: "Pencatatan",
      url: "/dashboard/debt",
      icon: BookOpen,
      isActive: pathname.startsWith("/dashboard/debt"),
    },
    {
      title: "Pembayaran",
      url: "/dashboard/payment",
      icon: CreditCard,
      isActive: pathname.startsWith("/dashboard/payment"),
    },
    // {
    //   title: "Status Pembayaran",
    //   url: "/dashboard/summary",
    //   icon: RefreshCw,
    //   isActive: pathname.startsWith("/dashboard/summary"),
    // },
  ];

  const settingItems = [
    ...(isSuperAdmin
      ? [
          {
            title: "Admin Manajemen",
            url: "/dashboard/admin-management",
            icon: Settings2,
            isActive: pathname.startsWith("/dashboard/admin-management"),
          },
        ]
      : []),
    // {
    //   title: "Lainnya",
    //   url: "/dashboard/others",
    //   icon: Ellipsis,
    //   isActive: pathname.startsWith("/dashboard/others"),
    // },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex justify-center items-center">
        <Link href="/dashboard" className="text-xl font-bold tracking-wide p-4">
          PayWise
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain features={fiturItems} settings={settingItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
