import { request, requestLoginForm } from "./client";
import { setAccessToken, setRefreshToken } from "./tokens";
import type { Role, User } from "@/dashboard/types";

/** Raw shape of UserOut, exactly as the backend returns it. */
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

export function mapUser(dto: UserOutDto): User {
  return {
    id: dto.id,
    fullName: dto.full_name,
    email: dto.email,
    phoneNumber: dto.phone_number,
    site: dto.site,
    role: dto.role,
    isActive: dto.is_active,
    createdAt: dto.created_at,
  };
}

/** Logs in, stores both tokens, and returns the signed-in user. Throws ApiError on bad credentials. */
export async function login(email: string, password: string): Promise<User> {
  const token = await requestLoginForm(email, password);
  setAccessToken(token.access_token);
  setRefreshToken(token.refresh_token);
  return me();
}

export async function me(): Promise<User> {
  const dto = await request<UserOutDto>("/api/v1/auth/me");
  return mapUser(dto);
}
