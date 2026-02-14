import { Role } from "./role";

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
