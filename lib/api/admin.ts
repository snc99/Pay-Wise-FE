import { api } from "./axios";

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

export async function createAdmin(payload: {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "ADMIN" | "SUPERADMIN";
}) {
  const res = await api.post("/admin", payload);
  return res.data;
}

export async function updateAdmin(
  id: string,
  payload: Partial<{
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "SUPERADMIN";
  }>,
) {
  const res = await api.put(`/admin/${id}`, payload);
  return res.data;
}

export async function deleteAdmin(id: string) {
  const res = await api.delete(`/admin/${id}`);
  return res.data;
}
