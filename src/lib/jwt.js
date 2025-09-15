// -------- Tokens --------
export function getToken() {
  return sessionStorage.getItem('access_token') || null;
}

export function getIdToken() {
  return (
    sessionStorage.getItem('id_token') ||
    localStorage.getItem('id_token') ||
    ''
  );
}

// -------- Utils --------
function safeAtob(b64) {
  if (typeof atob !== 'undefined') return atob(b64);
  // eslint-disable-next-line no-undef
  return Buffer.from(b64, 'base64').toString('binary');
}

export function parseJwt(token) {
  try {
    if (!token) return {};
    const raw = String(token).trim().replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
    const parts = raw.split('.');
    if (parts.length !== 3) return {};
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    return JSON.parse(safeAtob(b64)) || {};
  } catch {
    return {};
  }
}

export function getUsernameFromToken(token) {
  try {
    const p = parseJwt(token || '');
    return (p.preferred_username || p.username || p.sub || '') + '';
  } catch {
    return '';
  }
}

export function getUsername() {
  return getUsernameFromToken(getToken());
}

// roles / HR
export function getRolesFromToken(token) {
  const p = parseJwt(token || {});
  if (Array.isArray(p.roles)) return p.roles;
  if (Array.isArray(p.authorities)) return p.authorities;
  if (Array.isArray(p?.realm_access?.roles)) return p.realm_access.roles;
  return [];
}
export function isHR(token) {
  const roles = getRolesFromToken(token);
  return roles.includes('ROLE_HR') || roles.includes('HR');
}
export function getRoles() {
  return getRolesFromToken(getToken());
}

// -------- Local (token/storage) EMAIL fallback --------
const looksEmail = (s) => /^\S+@\S+\.\S+$/.test(String(s || ''));

function extractEmailFromJwt(token) {
  const p = parseJwt(token || '');
  if (!p || typeof p !== 'object') return '';
  const cands = [
    p.email,
    p.user_email,
    p.upn,
    p.preferred_username,
    p.username,
    looksEmail(p?.sub) ? p.sub : null,
  ].filter(Boolean).map(String);
  return cands.find(looksEmail) || '';
}

/**
 * Returns an email using only local information (tokens / localStorage).
 * This is a fallback used by the UI *only if* backend/userinfo don't return one.
 */
export function getLocalEmailFallback() {
  // tokens
  const idEmail = extractEmailFromJwt(getIdToken());
  const accEmail = idEmail ? '' : extractEmailFromJwt(getToken());
  let resolved = (idEmail || accEmail || '').trim();

  // saved by earlier steps (registration flow, etc.)
  if (!resolved && typeof localStorage !== 'undefined') {
    for (const k of ['registration_email', 'onboarding_email', 'reg_email']) {
      const v = (localStorage.getItem(k) || '').trim();
      if (looksEmail(v)) { resolved = v; break; }
    }
  }

  // last resort: if username itself is an email, use it
  if (!resolved) {
    const u = (getUsername() || '').trim();
    if (looksEmail(u)) resolved = u;
  }
  return resolved;
}