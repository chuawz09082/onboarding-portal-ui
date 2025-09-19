/**
 * Runtime-discovered service bases (no .env needed).
 * - Tries gateway (9000) first, then direct services (8083/8085), with/without prefixes.
 * - Caches the first working combo per tab/session.
 *
 * Exports keep your old function names so you don't have to change callers.
 */

import { getToken } from '../lib/jwt';

// ------------------------------
// Candidate endpoints to probe
// ------------------------------
const EMP_CANDIDATES = [
  { base: 'http://localhost:9000', prefix: '/employee-service' }, // gateway
  { base: 'http://localhost:8083', prefix: '/employee-service' }, // direct
  { base: 'http://localhost:8083', prefix: '' },                  // fallback
];

const VISA_CANDIDATES = [
  { base: 'http://localhost:9000', prefix: '' },                         // gateway
  { base: 'http://localhost:8085', prefix: '' },                         // direct (no context)
  { base: 'http://localhost:8085', prefix: '/visa-management' },         // possible ctx
  { base: 'http://localhost:8085', prefix: '/visa-management-backend' }, // alt ctx
];

// ------------------------------
// Small helpers
// ------------------------------
function join(base, prefix, path) {
  const b = String(base || '').replace(/\/+$/, '');
  const p = String(prefix || '').replace(/\/+$/, '');
  const s = path.startsWith('/') ? path : '/' + path;
  return `${b}${p}${s}`;
}

function authHeaders(token, extra = {}) {
  return { Authorization: `Bearer ${token}`, ...extra };
}

async function getJson(url, { headers, signal } = {}) {
  const r = await fetch(url, { headers, signal });
  if (!r.ok) throw new Error(`HTTP_${r.status}`);
  return r.status === 204 ? null : r.json();
}

async function probeFirstWorking(candidates, pathToProbe, headers) {
  for (const c of candidates) {
    const url = join(c.base, c.prefix, pathToProbe);
    try {
      const res = await fetch(url, { method: 'GET', headers });
      // Non-5xx and non-404 means routing works (even if 401/403)
      if (res && res.status !== 404 && res.status < 500) return c;
    } catch {
      // try next
    }
  }
  throw new Error(`No working base/prefix found for ${pathToProbe}`);
}

// ------------------------------
// Lazy, cached resolution
// ------------------------------
let _empResolved = null;
let _visaResolved = null;

async function resolveEmp(headers) {
  if (_empResolved) return _empResolved;
  // Prefer actuator if exposed; otherwise try known APIs
  try {
    _empResolved = await probeFirstWorking(EMP_CANDIDATES, '/actuator/health', headers);
  } catch {
    _empResolved = await probeFirstWorking(EMP_CANDIDATES, '/api/employees/by-user/ping', headers)
      .catch(() => probeFirstWorking(EMP_CANDIDATES, '/api/employees', headers));
  }
  return _empResolved;
}

async function resolveVisa(headers) {
  if (_visaResolved) return _visaResolved;
  try {
    _visaResolved = await probeFirstWorking(VISA_CANDIDATES, '/api/visa/hr/overview', headers);
  } catch {
    _visaResolved = await probeFirstWorking(VISA_CANDIDATES, '/api/visa/employee/ping/visa_status', headers)
      .catch(() => probeFirstWorking(VISA_CANDIDATES, '/api/visa/preview/ping', headers))
      .catch(() => probeFirstWorking(VISA_CANDIDATES, '/api/visa/documents/test/list', headers));
  }
  return _visaResolved;
}

async function eurl(path, { headers } = {}) {
  const cfg = await resolveEmp(headers);
  return join(cfg.base, cfg.prefix, path);
}

async function vurl(path, { headers } = {}) {
  const cfg = await resolveVisa(headers);
  return join(cfg.base, cfg.prefix, path);
}

/**
 * Optional: call once (e.g., in app startup) to warm both resolvers.
 * Not required—everything also resolves on first use.
 */
export async function initApiBases() {
  const token = getToken();
  const headers = authHeaders(token || '');
  await Promise.allSettled([resolveEmp(headers), resolveVisa(headers)]);
}

// -----------------------------------------
// Public API (keeps your existing function names)
// -----------------------------------------

/**
 * Get personal info by JWT subject (userId/sub from your token)
 * GET /employee-service/api/employees/by-user/{sub}
 */
export async function getEmployeeByUser({ sub, token, signal }) {
  if (!sub) throw new Error('MISSING_SUB');
  if (!token) throw new Error('UNAUTH');
  const headers = authHeaders(token);
  const url = await eurl(`/api/employees/by-user/${encodeURIComponent(sub)}`, { headers });
  return getJson(url, { headers, signal });
}

/**
 * Get application workflows by employeeId
 * GET /employee-service/api/applicationCheck/{employeeId}
 */
export async function getApplicationWorkflowsByEmployee({ employeeId, token, signal }) {
  if (!employeeId) throw new Error('MISSING_EMPLOYEE_ID');
  if (!token) throw new Error('UNAUTH');
  const headers = authHeaders(token);
  const url = await eurl(`/api/applicationCheck/${encodeURIComponent(employeeId)}`, { headers });
  const data = await getJson(url, { headers, signal });
  return Array.isArray(data) ? data : (data ? [data] : []);
}

// Sometimes handy:
export async function fetchAllEmployees({ token, signal }) {
  const headers = authHeaders(token || '');
  const url = await eurl('/api/employees', { headers });
  return getJson(url, { headers, signal });
}

export async function fetchEmployeeById({ id, token, signal }) {
  if (!id) throw new Error('MISSING_EMPLOYEE_ID');
  const headers = authHeaders(token || '');
  const url = await eurl(`/api/employees/${encodeURIComponent(id)}`, { headers });
  return getJson(url, { headers, signal });
}

// -------- Visa Management (8085 or via 9000) --------

export async function fetchVisaStatusByEmployee({ employeeId, token, signal }) {
  const headers = authHeaders(token || '');
  const url = await vurl(`/api/visa/employee/${encodeURIComponent(employeeId)}/visa_status`, { headers });
  return getJson(url, { headers, signal });
}

export async function fetchDocs({ employeeId, token, signal }) {
  const headers = authHeaders(token || '');
  const url = await vurl(`/api/visa/documents/${encodeURIComponent(employeeId)}/list`, { headers });
  const data = await getJson(url, { headers, signal });
  return Array.isArray(data) ? data : [];
}

export async function approveStemOpt({ employeeId, token }) {
  const headers = authHeaders(token || '');
  const url = await vurl(`/api/visa/hr/stem-opt/${encodeURIComponent(employeeId)}/approve`, { headers });
  const res = await fetch(url, { method: 'POST', headers });
  if (!res.ok) throw new Error(`HTTP_${res.status}`);
}

export async function rejectStemOpt({ employeeId, comment, token }) {
  const headers = authHeaders(token || '');
  const url = await vurl(`/api/visa/hr/stem-opt/${encodeURIComponent(employeeId)}/reject`, { headers });
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment: comment || '' }),
  });
  if (!res.ok) throw new Error(`HTTP_${res.status}`);
}

// ---------- Document preview/download helpers ----------

// Async builders ensure the resolved base is correct
export async function docPreviewUrlAsync(path, token) {
  const headers = authHeaders(token || '');
  return vurl(`/api/visa/preview/${encodeURIComponent(path)}`, { headers });
}
export async function docDownloadUrlAsync(path, token) {
  const headers = authHeaders(token || '');
  return vurl(`/api/visa/download/${encodeURIComponent(path)}`, { headers });
}

// Sync fallbacks for <a href>, if you already called initApiBases():
export function docPreviewUrl(path) {
  const cfg = _visaResolved || { base: 'http://localhost:8085', prefix: '' };
  return join(cfg.base, cfg.prefix, `/api/visa/preview/${encodeURIComponent(path)}`);
}
export function docDownloadUrl(path) {
  const cfg = _visaResolved || { base: 'http://localhost:8085', prefix: '' };
  return join(cfg.base, cfg.prefix, `/api/visa/download/${encodeURIComponent(path)}`);
}