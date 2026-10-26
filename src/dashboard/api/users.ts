import { request } from "./client";
import { mapUser } from "./auth";
import type { Role, User, UserCreateInput, UserUpdateInput } from "@/dashboard/types";

/** Backend caps page_size at 200 — this app fetches "everything" in one page rather than building paging UI, since fleet/staff counts stay well under that for the sites this system covers. */
const MAX_PAGE_SIZE = 200;

interface UserOutDto {
  full_name: string;
  email: string;
  phone_number: string | null;
  site: string | null;
  id: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export async function listUsers(): Promise<User[]> {
  const dtos = await request<UserOutDto[]>("/api/v1/users", { query: { page: 1, page_size: MAX_PAGE_SIZE } });
  return dtos.map(mapUser);
}

export async function createUser(input: UserCreateInput): Promise<User> {
  const dto = await request<UserOutDto>("/api/v1/users", {
    method: "POST",
    body: {
      full_name: input.fullName,
      email: input.email,
      phone_number: input.phoneNumber || null,
      site: input.site || null,
      role: input.role,
      password: input.password,
    },
  });
  return mapUser(dto);
}

export async function updateUser(userId: string, input: UserUpdateInput): Promise<User> {
  const dto = await request<UserOutDto>(`/api/v1/users/${userId}`, {
    method: "PATCH",
    body: {
      full_name: input.fullName,
      phone_number: input.phoneNumber,
      site: input.site,
      is_active: input.isActive,
      role: input.role,
    },
  });
  return mapUser(dto);
}
