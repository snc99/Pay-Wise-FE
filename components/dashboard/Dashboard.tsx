"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, clearToken } from "@/lib/api";

export default function DashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/auth/me", { method: "GET" });
        setUser(data?.user ?? null);
      } catch (err: any) {
        clearToken();
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <p className="text-sm text-gray-500">{user?.email}</p>
      {/* Konten dashboard */}
    </div>
  );
}
