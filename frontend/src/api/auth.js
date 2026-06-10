import {
  SF_AUTH_URL,
  SF_CLIENT_ID,
  SF_REDIRECT_URI,
  SF_SCOPES,
  SF_REVOKE_URL,
  STORAGE_KEYS,
} from "../utils/constants";

// ── Build Salesforce OAuth 2.0 Authorization URL (implicit / token flow) ──
export function buildAuthUrl() {
  const params = new URLSearchParams({
    response_type: "token",       // implicit flow – no backend required for SPA
    client_id:     SF_CLIENT_ID,
    redirect_uri:  SF_REDIRECT_URI,
    scope:         SF_SCOPES,
    prompt:        "login consent",
  });
  return `${SF_AUTH_URL}?${params.toString()}`;
}

// ── Parse the hash fragment Salesforce returns to /callback ───────────────
// e.g. #access_token=...&instance_url=...&token_type=Bearer&...
export function parseCallbackHash(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return {
    accessToken:      params.get("access_token"),
    instanceUrl:      params.get("instance_url"),
    refreshToken:     params.get("refresh_token"),
    tokenType:        params.get("token_type"),
    issuedAt:         params.get("issued_at"),
    scope:            params.get("scope"),
    error:            params.get("error"),
    errorDescription: params.get("error_description"),
  };
}

// ── Persist tokens to localStorage ────────────────────────────────────────
export function saveTokens({ accessToken, instanceUrl, refreshToken, userInfo }) {
  if (accessToken)  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN,  accessToken);
  if (instanceUrl)  localStorage.setItem(STORAGE_KEYS.INSTANCE_URL,  instanceUrl);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  if (userInfo)     localStorage.setItem(STORAGE_KEYS.USER_INFO,     JSON.stringify(userInfo));
}

// ── Load tokens from localStorage ─────────────────────────────────────────
export function loadTokens() {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  return {
    accessToken:  localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    instanceUrl:  localStorage.getItem(STORAGE_KEYS.INSTANCE_URL),
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
    userInfo:     raw ? JSON.parse(raw) : null,
  };
}

// ── Clear all stored auth data ─────────────────────────────────────────────
export function clearTokens() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}

// ── Revoke the current access token (best-effort) ─────────────────────────
export async function revokeToken(token) {
  try {
    await fetch(SF_REVOKE_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    new URLSearchParams({ token }),
    });
  } catch {
    /* ignore – we clear local state regardless */
  }
}

export function isTokenValid(token) {
  return Boolean(token && token.length > 10);
}