import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "./tokens";

// Base URL of the real backend, e.g. https://api.mfventures.com or
// http://173.230.136.155:8050 — set VITE_API_BASE_URL in .env.local for
// local development and in the Vercel project's environment variables for
// production. Left unset, every request fails fast with a clear error
// instead of silently hitting a relative path that doesn't exist.
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  fieldErrors: Array<{ field: string; message: string }>;

  constructor(status: number, message: string, fieldErrors: Array<{ field: string; message: string }> = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Raised once, on app start, when VITE_API_BASE_URL hasn't been configured. */
export class ApiNotConfiguredError extends Error {
  constructor() {
    super("VITE_API_BASE_URL is not set — the app doesn't know which backend to talk to.");
    this.name = "ApiNotConfiguredError";
  }
}

function requireBase(): string {
  if (!API_BASE) throw new ApiNotConfiguredError();
  return API_BASE;
}

/**
 * Shape FastAPI uses for its two error formats: a plain HTTPException
 * (`{"detail": "some message"}`) and a 422 validation error
 * (`{"detail": [{"loc": [...], "msg": "...", "type": "..."}]}`). Anything
 * else (a gateway timeout HTML page, an empty body) falls back to the raw
 * HTTP status text so the user still sees something sensible.
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return new ApiError(response.status, response.statusText || `Request failed (${response.status})`);
  }

  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;

    if (typeof detail === "string") {
      return new ApiError(response.status, detail);
    }

    if (Array.isArray(detail)) {
      const fieldErrors = detail
        .filter((item): item is { loc: unknown[]; msg: string } => typeof item?.msg === "string")
        .map((item) => ({
          field: Array.isArray(item.loc) ? item.loc.filter((p) => p !== "body").join(".") : "",
          message: item.msg,
        }));
      const summary = fieldErrors.length > 0 ? fieldErrors.map((e) => (e.field ? `${e.field}: ${e.message}` : e.message)).join("; ") : "Validation failed.";
      return new ApiError(response.status, summary, fieldErrors);
    }
  }

  return new ApiError(response.status, response.statusText || `Request failed (${response.status})`);
}

/** Calls POST /auth/refresh directly (not through `request`, to avoid recursive refresh logic). */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${requireBase()}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return false;

    const data = (await response.json()) as { access_token: string; refresh_token: string };
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Query string parameters; `undefined`/`null` values are omitted. */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Skips attaching an Authorization header — only auth/login needs this. */
  skipAuth?: boolean;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${requireBase()}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Core JSON request helper. Attaches the bearer token automatically, and on
 * a 401 tries exactly one silent refresh-and-retry before giving up — so a
 * normal access-token expiry is invisible to the user, but a truly dead
 * session (expired/invalid refresh token) surfaces as a real error that the
 * caller (DashboardProvider) turns into a forced logout.
 */
export async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { method = "GET", body, query, skipAuth = false, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (response.status === 401 && !skipAuth && !isRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, options, true);
    }
    clearTokens();
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Login is the one endpoint that takes `application/x-www-form-urlencoded`, per the OAuth2 password flow. */
export async function requestLoginForm(username: string, password: string): Promise<{ access_token: string; refresh_token: string; token_type: string }> {
  const body = new URLSearchParams({ grant_type: "password", username, password, scope: "" });

  const response = await fetch(`${requireBase()}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
  });

  if (!response.ok) {
    const err = await parseErrorResponse(response);
    // FastAPI's OAuth2PasswordRequestForm reports bad credentials as a plain
    // 400/401 with a generic detail — give a clearer message for that case.
    if (response.status === 400 || response.status === 401) {
      throw new ApiError(response.status, "Incorrect email or password.");
    }
    throw err;
  }

  return response.json();
}

/** File uploads use multipart/form-data — the browser sets the boundary, so we must not set Content-Type ourselves. */
export async function requestMultipart<T>(path: string, formData: FormData, isRetry = false): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(buildUrl(path), { method: "POST", headers, body: formData });

  if (response.status === 401 && !isRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return requestMultipart<T>(path, formData, true);
    clearTokens();
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  if (!response.ok) throw await parseErrorResponse(response);
  return response.json();
}

export { refreshAccessToken };
