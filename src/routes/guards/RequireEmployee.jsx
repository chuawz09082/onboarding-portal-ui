import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken, parseJwt } from '../../lib/jwt';

const readRoles = (claims) => {
  // adapt to your token: roles / authorities / scope (space-separated)
  const raw = claims?.roles ?? claims?.authorities ?? claims?.scope ?? [];
  return Array.isArray(raw) ? raw : String(raw).split(/\s+/).filter(Boolean);
};

export default function RequireEmployee() {
  const loc = useLocation();
  const token = getToken();
  const claims = token ? parseJwt(token) : null;

  if (!claims) return <Navigate to="/login" replace state={{ from: loc }} />;

  const roles = readRoles(claims).map(r => r.toUpperCase());
  const hasEmployee = roles.includes('EMPLOYEE') || roles.includes('ROLE_EMPLOYEE');
  const hasHr       = roles.includes('HR')       || roles.includes('ROLE_HR');

  // allow only "pure" employees (EMPLOYEE present AND HR absent)
  if (!hasEmployee || hasHr) return <Navigate to="/" replace />; // or /403

  return <Outlet />;
}