export function getToken() {
    return sessionStorage.getItem('access_token') || null;
  }
  
  export function parseJwt(token) {
    try {
      const [, payload] = token.split('.');
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return {};
    }
  }
  
  export function getRolesFromToken(token) {
    const p = parseJwt(token || '');
    return Array.isArray(p.roles) ? p.roles : [];
  }
  
  export function isHR(token) {
    return getRolesFromToken(token).includes('ROLE_HR');
  }

  export function getRoles() {
    return getRolesFromToken(getToken());
  }