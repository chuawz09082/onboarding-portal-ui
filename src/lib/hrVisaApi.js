const EMP_BASE   = import.meta.env.VITE_EMPLOYEE_BASE   ?? 'http://localhost:8083';
const EMP_PREFIX = import.meta.env.VITE_EMPLOYEE_PREFIX ?? '/employee-service'; // you said this path works

const VISA_BASE   = import.meta.env.VITE_VISA_BASE   ?? 'http://localhost:8085';
const VISA_PREFIX = import.meta.env.VITE_VISA_PREFIX ?? ''; // set if your visa service has a context path

function join(base, prefix, path) {
  const b = base.replace(/\/+$/, '');
  const p = (prefix || '').replace(/\/+$/, '');
  const s = path.startsWith('/') ? path : '/' + path;
  return `${b}${p}${s}`;
}
const eurl = (p) => join(EMP_BASE,  EMP_PREFIX,  p);
const vurl = (p) => join(VISA_BASE, VISA_PREFIX, p);

function authHeaders(token, extra={}) { return { Authorization: `Bearer ${token}`, ...extra }; }

async function getJson(url, { headers, signal } = {}) {
  const r = await fetch(url, { headers, signal });
  if (!r.ok) throw new Error(`HTTP_${r.status}`);
  return r.status === 204 ? null : r.json();
}

// --- Already-existing endpoints ---
export async function fetchAllEmployees({ token, signal }) {
  return getJson(eurl('/api/employees'), { headers: authHeaders(token), signal });
}
export async function fetchVisaStatusByEmployee({ employeeId, token, signal }) {
  return getJson(vurl(`/api/visa/employee/${encodeURIComponent(employeeId)}/visa_status`), {
    headers: authHeaders(token), signal
  });
}
export async function fetchDocs({ employeeId, token, signal }) {
  const data = await getJson(vurl(`/api/visa/documents/${encodeURIComponent(employeeId)}/list`), {
    headers: authHeaders(token), signal
  });
  return Array.isArray(data) ? data : [];
}
export const docPreviewUrl  = (path) => vurl(`/api/visa/preview/${encodeURIComponent(path)}`);
export const docDownloadUrl = (path) => vurl(`/api/visa/download/${encodeURIComponent(path)}`);

// --- Optional (wire for when you add them). If 404, we’ll disable in UI ---
export async function approveStemOpt({ employeeId, token }) {
  const res = await fetch(vurl(`/api/visa/hr/stem-opt/${encodeURIComponent(employeeId)}/approve`), {
    method: 'POST', headers: authHeaders(token)
  });
  if (!res.ok) throw new Error(`HTTP_${res.status}`);
}
export async function rejectStemOpt({ employeeId, comment, token }) {
  const res = await fetch(vurl(`/api/visa/hr/stem-opt/${encodeURIComponent(employeeId)}/reject`), {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment: comment || '' })
  });
  if (!res.ok) throw new Error(`HTTP_${res.status}`);
}