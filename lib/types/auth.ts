import type { Role } from "./admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
};

export type AuthResponse = {
  success: AuthUser;
  user: AuthUser;
};
