"use client";

import * as React from "react";
import {
  BookOpen,
  CreditCard,
  Ellipsis,
  RefreshCw,
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * NOTE:
 * - Pastikan endpoint ME di backend sesuai. Di contoh ini aku pakai:
 *   `${process.env.NEXT_PUBLIC_API || "https://pay-wise-be.up.railway.app/api"}/auth/me`
 * - Pastikan backend mengembalikan sesuatu seperti:
 *   { id, name, username, email, role }  dimana role bisa "superadmin", "admin", dll.
 */

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [loading, setLoading] = useState<boolean>(true);
//   const [user, setUser] = useState<any | null>(null);
//   const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

//   // helper: ambil token yg disimpan (sesuaikan key kalau beda)
//   const getTokenFromStorage = () => {
//     try {
//       return typeof window !== "undefined"
//         ? localStorage.getItem("pw_token")
//         : null;
//     } catch {
//       return null;
//     }
//   };

//   useEffect(() => {
//     let mounted = true;
//     async function fetchMe() {
//       setLoading(true);
//       const token = getTokenFromStorage();
//       try {
//         const API_BASE =
//           process.env.NEXT_PUBLIC_API ||
//           "https://pay-wise-be.up.railway.app/api";
//         const res = await fetch(`${API_BASE}/auth/me`, {
//           headers: token
//             ? {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               }
//             : { "Content-Type": "application/json" },
//           credentials: "include",
//         });

//         if (!mounted) return;

//         if (res.ok) {
//           const data = await res.json();
//           setUser(data);
//           // contoh: backend mengirim { role: "superadmin" } atau serupa
//           setIsSuperAdmin(String(data?.role).toLowerCase() === "superadmin");
//         } else {
//           // jika token invalid / unauthorized -> keluarkan user / redirect login jika perlu
//           setUser(null);
//           setIsSuperAdmin(false);
//           // optional: redirect ke login kalau perlu
//           // if (res.status === 401) router.push("/login");
//         }
//       } catch (err) {
//         console.error("Failed to fetch /auth/me", err);
//         setUser(null);
//         setIsSuperAdmin(false);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     fetchMe();
//     return () => {
//       mounted = false;
//     };
//   }, [router]);

//   const userData = {
//     name: user?.name || "Admin",
//     username: user?.username || "admin",
//     email: user?.email || "admin@example.com",
//     avatar: "/avatar.png",
//   };

//   const fiturItems = [
//     {
//       title: "Dashboard",
//       url: "/dashboard",
//       icon: SquareTerminal,
//       isActive: pathname === "/dashboard",
//     },
//     {
//       title: "Pengguna",
//       url: "/dashboard/user",
//       icon: User,
//       isActive: pathname === "/dashboard/user",
//     },
//     {
//       title: "Pencatatan",
//       url: "/dashboard/debt",
//       icon: BookOpen,
//       isActive: pathname === "/dashboard/debt",
//     },
//     {
//       title: "Pembayaran",
//       url: "/dashboard/payment",
//       icon: CreditCard,
//       isActive: pathname === "/dashboard/payment",
//     },
//     {
//       title: "Status Pembayaran",
//       url: "/dashboard/summary",
//       icon: RefreshCw,
//       isActive: pathname === "/dashboard/summary",
//     },
//   ];

//   const settingItems = [
//     // tampilkan Manajemen Akun hanya kalau superadmin
//     ...(isSuperAdmin
//       ? [
//           {
//             title: "Manajemen Akun",
//             url: "/dashboard/add-account",
//             icon: Settings2,
//             isActive: pathname === "/dashboard/add-account",
//           },
//         ]
//       : []),
//     {
//       title: "Lainnya",
//       url: "/dashboard",
//       icon: Ellipsis,
//       isActive: pathname === "/dashboard",
//     },
//   ];

//   // Loading state: bisa diganti spinner/custom skeleton
//   if (loading) {
//     return (
//       <Sidebar collapsible="icon" {...props}>
//         <SidebarHeader className="flex justify-center items-center">
//           <Link
//             href="/dashboard"
//             className="text-xl font-bold tracking-wide p-4"
//           >
//             PayWise
//           </Link>
//         </SidebarHeader>
//         <SidebarContent>
//           <div className="p-4">Memuat sidebar…</div>
//         </SidebarContent>
//         <SidebarFooter>
//           <NavUser user={userData} />
//         </SidebarFooter>
//         <SidebarRail />
//       </Sidebar>
//     );
//   }

//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader className="flex justify-center items-center">
//         <Link href="/dashboard" className="text-xl font-bold tracking-wide p-4">
//           PayWise
//         </Link>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain features={fiturItems} settings={settingItems} />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={userData} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }

// ... imports tetap sama
export function AppSidebar({
  user,
  isSuperAdmin = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: any | null;
  isSuperAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Hapus useEffect fetching /auth/me di sini
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
      isActive: pathname === "/dashboard/user",
    },
    {
      title: "Pencatatan",
      url: "/dashboard/debt",
      icon: BookOpen,
      isActive: pathname === "/dashboard/debt",
    },
    {
      title: "Pembayaran",
      url: "/dashboard/payment",
      icon: CreditCard,
      isActive: pathname === "/dashboard/payment",
    },
    {
      title: "Status Pembayaran",
      url: "/dashboard/summary",
      icon: RefreshCw,
      isActive: pathname === "/dashboard/summary",
    },
  ];

  const settingItems = [
    ...(isSuperAdmin
      ? [
          {
            title: "Manajemen Akun",
            url: "/dashboard/add-account",
            icon: Settings2,
            isActive: pathname === "/dashboard/add-account",
          },
        ]
      : []),
    {
      title: "Lainnya",
      url: "/dashboard",
      icon: Ellipsis,
      isActive: pathname === "/dashboard",
    },
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
