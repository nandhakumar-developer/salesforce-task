import { useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchValidationRules, deployChanges } from "../api/salesforce";

export function useValidationRules() {
  const { accessToken, instanceUrl } = useAuth();

  const [serverRules, setServerRules] = useState([]);   // last-known server state
  const [rules, setRules]             = useState([]);   // working local copy
  const [pendingIds, setPendingIds]   = useState(new Set());

  const [isFetching, setIsFetching]   = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [fetchError, setFetchError]   = useState(null);
  const [deployResult, setDeployResult] = useState(null);

  const hasFetchedRef = useRef(false);

  // ── Fetch all Account validation rules ──────────────────────────────────
  const fetchRules = useCallback(async () => {
    if (!accessToken || !instanceUrl) return;
    setIsFetching(true);
    setFetchError(null);
    try {
      const data = await fetchValidationRules(instanceUrl, accessToken);
      setServerRules(data);
      setRules(data.map((r) => ({ ...r })));
      setPendingIds(new Set());
      hasFetchedRef.current = true;
    } catch (err) {
      setFetchError(err.message || "Failed to fetch rules");
    } finally {
      setIsFetching(false);
    }
  }, [accessToken, instanceUrl]);

  // ── Toggle a single rule locally (optimistic) ───────────────────────────
  const toggleRule = useCallback(
    (ruleId) => {
      setRules((prev) =>
        prev.map((r) => (r.Id === ruleId ? { ...r, Active: !r.Active } : r))
      );
      setPendingIds((prev) => {
        const next    = new Set(prev);
        const server  = serverRules.find((r) => r.Id === ruleId);
        const local   = rules.find((r) => r.Id === ruleId);
        if (!server || !local) return next;
        // If the new local value equals the server value → no longer pending
        const newActive = !local.Active;
        newActive !== server.Active ? next.add(ruleId) : next.delete(ruleId);
        return next;
      });
    },
    [rules, serverRules]
  );

  // ── Bulk activate all ────────────────────────────────────────────────────
  const activateAll = useCallback(() => {
    setRules((prev) => prev.map((r) => ({ ...r, Active: true })));
    setPendingIds(new Set(serverRules.filter((r) => !r.Active).map((r) => r.Id)));
  }, [serverRules]);

  // ── Bulk deactivate all ──────────────────────────────────────────────────
  const deactivateAll = useCallback(() => {
    setRules((prev) => prev.map((r) => ({ ...r, Active: false })));
    setPendingIds(new Set(serverRules.filter((r) => r.Active).map((r) => r.Id)));
  }, [serverRules]);

  // ── Reset local changes back to server state ─────────────────────────────
  const resetChanges = useCallback(() => {
    setRules(serverRules.map((r) => ({ ...r })));
    setPendingIds(new Set());
  }, [serverRules]);

  // ── Deploy all pending changes to Salesforce ─────────────────────────────
  const deploy = useCallback(async () => {
    if (pendingIds.size === 0) return;
    setIsDeploying(true);
    setDeployResult(null);

    const pending = rules
      .filter((r) => pendingIds.has(r.Id))
      .map((r) => ({ id: r.Id, active: r.Active, name: r.ValidationName }));

    try {
      const results  = await deployChanges(instanceUrl, accessToken, pending);
      const success  = results.filter((r) => r.success);
      const failed   = results.filter((r) => !r.success);

      if (failed.length === 0) {
        // All good → sync server state
        setServerRules(rules.map((r) => ({ ...r })));
        setPendingIds(new Set());
      } else {
        // Partial → only sync the successful ones
        const okIds = new Set(success.map((r) => r.id));
        setServerRules((prev) =>
          prev.map((sr) => {
            if (okIds.has(sr.Id)) {
              const updated = rules.find((r) => r.Id === sr.Id);
              return updated ? { ...updated } : sr;
            }
            return sr;
          })
        );
        setPendingIds((prev) => {
          const next = new Set(prev);
          okIds.forEach((id) => next.delete(id));
          return next;
        });
      }
      setDeployResult({ success, failed });
    } catch (err) {
      setDeployResult({
        success: [],
        failed: pending.map((c) => ({ ...c, error: err.message })),
      });
    } finally {
      setIsDeploying(false);
    }
  }, [accessToken, instanceUrl, pendingIds, rules]);

  return {
    rules,
    isFetching,
    isDeploying,
    fetchError,
    deployResult,
    pendingIds,
    hasFetched: hasFetchedRef.current,
    fetchRules,
    toggleRule,
    activateAll,
    deactivateAll,
    resetChanges,
    deploy,
    clearDeployResult: () => setDeployResult(null),
  };
}