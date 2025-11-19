// contoh di komponen tombol logout
import { apiFetch, clearToken } from "@/lib/api";
import { useRouter } from "next/navigation";

async function doLogout(router: ReturnType<typeof useRouter>) {
  try {
    await apiFetch("/logout", { method: "POST" });
  } catch (e) {
    // ignore error
  } finally {
    clearToken();
    router.push("/login");
  }
}
