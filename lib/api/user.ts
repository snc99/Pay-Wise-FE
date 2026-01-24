import { api } from "./axios";

type GetUsersParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function getUsers(params: GetUsersParams = {}) {
  const res = await api.get("/user", {
    params: {
      search: params.search,
      page: params.page,
      limit: params.limit ?? 7,
    },
  });

  return res.data;
}

export async function createUser(payload: {
  name: string;
  phone: string;
  address: string;
}) {
  const res = await api.post("/user", payload);
  return res.data;
}

export async function updateUser(
  id: string,
  payload: Partial<{
    name: string;
    phone: string;
    address: string;
  }>,
) {
  const res = await api.put(`/user/${id}`, payload);
  return res.data;
}

export async function deleteUser(id: string) {
  const res = await api.delete(`/user/${id}`);
  return res.data;
}

export async function searchUsers(query: string, limit = 10) {
  const res = await api.get("/user/search", {
    params: { query, limit },
  });

  return res.data;
}
