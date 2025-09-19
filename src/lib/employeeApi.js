// ==== Base config ====
// For your current working setup (direct to service w/ context path):
//   http://localhost:8083/employee-service/...
// You can override these in .env.local if you later route via gateway.
const EMP_BASE  = import.meta.env.VITE_EMPLOYEE_BASE  ?? 'http://localhost:8083';
const EMP_PREFIX = import.meta.env.VITE_EMPLOYEE_PREFIX ?? '/employee-service'; // keep the context path you have

// Builds a full URL like: http://localhost:8083/employee-service/api/... 
function empUrl(path) {
  const base = EMP_BASE.replace(/\/+$/, '');
  const pref = EMP_PREFIX.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${pref}${p}`;
}

// Common headers with Bearer token
function authHeaders(token, extra = {}) {
  return {
    'Authorization': `Bearer ${token}`,
    ...extra,
  };
}

// Generic fetch wrapper (JSON only)
async function getJson(url, { headers, signal } = {}) {
  const res = await fetch(url, { headers, signal });
  if (res.status === 401) throw new Error('UNAUTH');
  if (res.status === 404) return { ok: true, json: null, status: 404 };
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const msg = text || `HTTP_${res.status}`;
    throw new Error(msg);
  }
  return { ok: true, json: await res.json(), status: res.status };
}

/**
 * Get personal info by JWT subject (userId/sub from your token)
 * GET /employee-service/api/employees/by-user/{sub}
 */
export async function getEmployeeByUser({ sub, token, signal }) {
  if (!sub) throw new Error('MISSING_SUB');
  if (!token) throw new Error('UNAUTH');

  const url = empUrl(`/api/employees/by-user/${encodeURIComponent(sub)}`);
  const { json, status } = await getJson(url, { headers: authHeaders(token), signal });
  if (status === 404) return null; // no employee yet
  return json; // PersonalInfoView
}

/**
 * Get application workflows by employeeId
 * GET /employee-service/api/applicationCheck/{employeeId}
 */
export async function getApplicationWorkflowsByEmployee({ employeeId, token, signal }) {
  if (!employeeId) throw new Error('MISSING_EMPLOYEE_ID');
  if (!token) throw new Error('UNAUTH');

  const url = empUrl(`/api/applicationCheck/${encodeURIComponent(employeeId)}`);
  const { json, status } = await getJson(url, { headers: authHeaders(token), signal });
  if (status === 404 || json == null) return []; // treat as no workflows
  return Array.isArray(json) ? json : [];
}

/* =========================
   Optional helpers you may want
   ========================= */

/**
 * Get personal info by employee id (string id)
 * GET /employee-service/api/employees/{id}
 */
export async function getEmployeeById({ id, token, signal }) {
  if (!id) throw new Error('MISSING_EMPLOYEE_ID');
  if (!token) throw new Error('UNAUTH');

  const url = empUrl(`/api/employees/${encodeURIComponent(id)}`);
  const { json, status } = await getJson(url, { headers: authHeaders(token), signal });
  if (status === 404) return null;
  return json;
}