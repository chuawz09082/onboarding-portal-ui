import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getToken, parseJwt, isHR as isHRRole } from "../../lib/jwt";
import { fetchMeStatus } from "../../api/me";

const TTL = 60_000;
const VALID = new Set(["ONBOARDING", "REGISTERED", "REGISTERED_INCOMPLETE"]);

function normalizeState(raw) {
  const s = (raw ?? "").toString().trim().toUpperCase();
  if (s === "REGISTERED-INCOMPLETE" || s === "REG_INCOMPLETE") return "REGISTERED_INCOMPLETE";
  // map any synonyms your backend might use:
  if (s === "PENDING" || s === "NEW") return "ONBOARDING";
  return VALID.has(s) ? s : null;
}

function useAccountState() {
  const [state, setState] = useState(null);     // 'ONBOARDING' | 'REGISTERED' | 'REGISTERED_INCOMPLETE' | null
  const [roles, setRoles] = useState([]);       // optional: if your backend sends roles
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const sub = useMemo(() => (token ? parseJwt(token)?.sub : null), [token]);
  const cacheKey = useMemo(() => (sub ? `me_status_cache_${sub}` : null), [sub]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token || !sub) {
        if (alive) setState(null), setRoles([]), setLoading(false);
        return;
      }

      // per-user cache
      if (cacheKey) {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.t < TTL) {
              if (alive) {
                setState(normalizeState(parsed.state));
                setRoles(parsed.roles ?? []);
                setLoading(false);
                return;
              }
            }
          } catch {}
        }
      }

      try {
        const res = await fetchMeStatus(); // { userId, email, state, roles? }
        const norm = normalizeState(res?.state);
        if (!alive) return;
        setState(norm);
        setRoles(Array.isArray(res?.roles) ? res.roles : []);
        if (cacheKey) {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ t: Date.now(), state: res?.state, roles: res?.roles || [] })
          );
        }
      } catch (e) {
        console.error("fetchMeStatus failed:", e);
        if (alive) setState(null), setRoles([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [token, sub, cacheKey]);

  const isHR = token ? (isHRRole(token) || roles.includes("ROLE_HR") || roles.includes("HR")) : false;
  return { state, loading, isHR };
}

/** Main app guard: if ONBOARDING → kick to /onboarding; others (registered/HR) allowed */
export function RequireRegistered() {
  const { loading, state, isHR } = useAccountState();
  if (loading) return null;
  if (isHR) return <Outlet />;
  if (state === "ONBOARDING") return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

/** Onboarding-only guard: only ONBOARDING allowed; others → /home */
export function RequireOnboarding() {
  const { loading, state, isHR } = useAccountState();
  if (loading) return null;
  if (isHR) return <Navigate to="/home" replace />;
  if (state !== "ONBOARDING") return <Navigate to="/home" replace />;
  return <Outlet />;
}

/** "/" landing chooser by state */
export function AfterLoginLanding() {
  const { loading, state, isHR } = useAccountState();
  if (loading) return null;
  if (isHR) return <Navigate to="/home" replace />;
  return state === "ONBOARDING" ? (
    <Navigate to="/onboarding" replace />
  ) : (
    <Navigate to="/home" replace />
  );
}