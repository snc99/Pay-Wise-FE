// lib/types/user.ts
export type User = {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
};
