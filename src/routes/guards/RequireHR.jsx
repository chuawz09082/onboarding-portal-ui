import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken, parseJwt } from '../../lib/jwt';

const readRoles = (claims) => {
  // adapt to your token: roles / authorities / scope (space-separated)
  const raw = claims?.roles ?? claims?.authorities ?? claims?.scope ?? [];
  return Array.isArray(raw) ? raw : String(raw).split(/\s+/).filter(Boolean);
};

export default function RequireHR() {
  const loc = useLocation();
  const token = getToken();
  const claims = token ? parseJwt(token) : null;

  if (!claims) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }

  const roles = readRoles(claims).map((r) => r.toUpperCase());
  const hasHr = roles.includes('HR') || roles.includes('ROLE_HR');

  if (!hasHr) {
    // not HR → bounce (choose your destination: /403 or home)
    return <Navigate to="/home" replace state={{ from: loc }} />;
  }

  // HR users often also have EMPLOYEE; that's fine.
  return <Outlet />;
}