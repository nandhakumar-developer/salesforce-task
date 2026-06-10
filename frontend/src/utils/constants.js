// ── Salesforce OAuth & API constants ──────────────────────────────────────

export const SF_LOGIN_URL =
  import.meta.env.VITE_SF_LOGIN_URL || "https://login.salesforce.com";

export const SF_CLIENT_ID = import.meta.env.VITE_SF_CLIENT_ID || "";

export const SF_REDIRECT_URI =
  import.meta.env.VITE_SF_REDIRECT_URI || "http://localhost:5173/callback";

// OAuth 2.0 scopes  (api = REST access, refresh_token, web)
export const SF_SCOPES = "api refresh_token web";

// OAuth endpoints
export const SF_AUTH_URL   = `${SF_LOGIN_URL}/services/oauth2/authorize`;
export const SF_TOKEN_URL  = `${SF_LOGIN_URL}/services/oauth2/token`;
export const SF_REVOKE_URL = `${SF_LOGIN_URL}/services/oauth2/revoke`;

// Tooling / REST API version
export const SF_API_VERSION  = "v59.0";
export const TOOLING_API_BASE = `/services/data/${SF_API_VERSION}/tooling`;

// localStorage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN:  "sf_access_token",
  INSTANCE_URL:  "sf_instance_url",
  USER_INFO:     "sf_user_info",
  REFRESH_TOKEN: "sf_refresh_token",
};