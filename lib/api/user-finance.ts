import { api } from "./axios";

/**
 * ============================
 * GET /users/with-debt
 * ============================
 */
export async function searchUsersWithDebt(search: string, limit = 10) {
  const res = await api.get("/users/with-debt", {
    params: { search, limit },
  });

  return res.data;
}

/**
 * ============================
 * GET /users/:id/history
 * ============================
 */
export async function getUserHistory(userId: string) {
  const res = await api.get(`/users/${userId}/history`);
  return res.data;
}
