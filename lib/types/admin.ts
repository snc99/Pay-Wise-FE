// lib/types/admin.ts
export type Role = "SUPERADMIN" | "ADMIN";

export type Admin = {
  id: string;
  username: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
