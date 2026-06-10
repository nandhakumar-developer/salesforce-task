import axios from "axios";
import { TOOLING_API_BASE } from "../utils/constants";

// ── Create a scoped Axios instance ────────────────────────────────────────
export function createSFClient(instanceUrl, accessToken) {
  const client = axios.create({
    baseURL: instanceUrl,
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      const msg =
        err.response?.data?.[0]?.message ||
        err.response?.data?.message ||
        err.message ||
        "Salesforce API error";
      return Promise.reject(new Error(msg));
    }
  );

  return client;
}

// ── Fetch current user info ───────────────────────────────────────────────
export async function fetchUserInfo(instanceUrl, accessToken) {
  const client = createSFClient(instanceUrl, accessToken);
  const res = await client.get("/services/oauth2/userinfo");
  return res.data;
}

// ── Fetch ALL Account validation rules via Tooling API SOQL ──────────────
//    Fields: Id, ValidationName, Active, Description,
//            ErrorMessage, ErrorDisplayField, CreatedDate, LastModifiedDate
export async function fetchValidationRules(instanceUrl, accessToken) {
  const client = createSFClient(instanceUrl, accessToken);

  const soql = encodeURIComponent(
    `SELECT Id, ValidationName, Active, Description,
            ErrorMessage, ErrorDisplayField, CreatedDate, LastModifiedDate
     FROM   ValidationRule
     WHERE  EntityDefinition.QualifiedApiName = 'Account'
     ORDER BY ValidationName ASC`
  );

  const res = await client.get(`${TOOLING_API_BASE}/query?q=${soql}`);
  return res.data.records || [];
}

// ── Toggle a single rule (PATCH Tooling API) ──────────────────────────────
//    Salesforce requires us to PATCH the full Metadata object,
//    so we fetch the existing one first then flip only the `active` field.
export async function toggleValidationRule(instanceUrl, accessToken, ruleId, currentActive) {
  const client = createSFClient(instanceUrl, accessToken);

  const existing = await client.get(
    `${TOOLING_API_BASE}/sobjects/ValidationRule/${ruleId}`
  );
  const metadata = existing.data.Metadata || {};

  await client.patch(
    `${TOOLING_API_BASE}/sobjects/ValidationRule/${ruleId}`,
    { Metadata: { ...metadata, active: !currentActive } }
  );

  return { id: ruleId, active: !currentActive };
}

// ── Deploy all pending changes ────────────────────────────────────────────
//    pendingChanges: [{ id, active, name }]
export async function deployChanges(instanceUrl, accessToken, pendingChanges) {
  const client = createSFClient(instanceUrl, accessToken);

  const results = await Promise.allSettled(
    pendingChanges.map(async (change) => {
      const existing = await client.get(
        `${TOOLING_API_BASE}/sobjects/ValidationRule/${change.id}`
      );
      const metadata = existing.data.Metadata || {};

      await client.patch(
        `${TOOLING_API_BASE}/sobjects/ValidationRule/${change.id}`,
        { Metadata: { ...metadata, active: change.active } }
      );
      return { id: change.id, name: change.name, success: true };
    })
  );

  return results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { id: null, success: false, error: r.reason?.message }
  );
}