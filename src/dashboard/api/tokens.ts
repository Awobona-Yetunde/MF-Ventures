// Token storage for the real backend's OAuth2 bearer auth.
//
// The access token lives only in memory (module scope) — it's short-lived
// and never needs to survive a page reload. The refresh token is the one
// thing that does need to survive a reload (so the session doesn't vanish
// every time the tab refreshes), so it goes in localStorage. On app start,
// DashboardProvider uses the stored refresh token to silently obtain a new
// access token and re-populate the session.

const REFRESH_TOKEN_KEY = "mfv_refresh_token";

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch {
    // Private browsing / storage disabled — the session just won't survive a refresh.
  }
}

/** Clears both tokens — called on logout and on an unrecoverable 401. */
export function clearTokens(): void {
  setAccessToken(null);
  setRefreshToken(null);
}
