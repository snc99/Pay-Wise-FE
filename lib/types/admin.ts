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

export type CreateAdminPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
};

export type UpdateAdminPayload = Partial<CreateAdminPayload>;
