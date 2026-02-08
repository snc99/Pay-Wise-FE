import { api } from "./axios";
import type { CreateAdminPayload, UpdateAdminPayload } from "@/lib/types/admin";
type GetAdminsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function getAdmins(params: GetAdminsParams = {}) {
  const res = await api.get("/admin", {
    params: {
      search: params.search,
      page: params.page,
      limit: params.limit ?? 7,
    },
  });

  return res.data;
}

export async function createAdmin(payload: CreateAdminPayload) {
  const res = await api.post("/admin", payload);
  return res.data;
}

export async function updateAdmin(id: string, payload: UpdateAdminPayload) {
  const res = await api.put(`/admin/${id}`, payload);
  return res.data;
}

export async function deleteAdmin(id: string) {
  const res = await api.delete(`/admin/${id}`);
  return res.data;
}
