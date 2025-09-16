import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getToken, getUsername, getLocalEmailFallback } from '../lib/jwt';
import { logout } from '../redux/store/authSlice';
import API from '../lib/http';

const emailRegex = /^\S+@\S+\.\S+$/;

export default function Topbar() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const username = getUsername();
  const [email, setEmail] = useState('');

  useEffect(() => {
    let mounted = true;
    const access = getToken();

    (async () => {
      let resolved = '';

      // 1) DB-backed profile (if available)
      try {
        const r = await API.get('/application-service/api/onboarding/me', { validateStatus: () => true });
        if (r.status === 200 && r.data?.email && emailRegex.test(r.data.email)) {
          resolved = r.data.email.trim();
        }
      } catch {}

      // 2) OIDC userinfo
      if (!resolved) {
        try {
          const r = await API.get('/oauth2/userinfo', { validateStatus: () => true });
          const uinfoEmail = r?.data?.email || r?.data?.preferred_username || r?.data?.upn;
          if (r.status === 200 && uinfoEmail && emailRegex.test(uinfoEmail)) {
            resolved = String(uinfoEmail).trim();
          }
        } catch {}
      }

      // 3) Local fallback (dev)
      if (!resolved) {
        const local = getLocalEmailFallback?.();
        if (local) resolved = local;
      }

      // 4) Last resort: parse JWT claim
      if (!resolved && access) {
        try {
          const payload = JSON.parse(
            atob(access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
          );
          const jwtEmail = payload.email || payload.preferred_username || payload.upn || '';
          if (jwtEmail && emailRegex.test(jwtEmail)) resolved = jwtEmail;
        } catch {}
      }

      if (mounted) setEmail(resolved);
    })();

    return () => { mounted = false; };
  }, []);

  async function doLogout() {
    try { await API.post('/logout').catch(() => {}); } finally {
      dispatch(logout());
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('access_token');
      if (API?.defaults?.headers?.common) delete API.defaults.headers.common['Authorization'];
      nav('/login', { replace: true });
    }
  }

  const initials = (username || email || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="fixed top-0 left-64 right-0 h-18 bg-white shadow-sm border-b border-gray-200 flex items-center justify-end px-6 z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              <strong>{username || 'user'}</strong>
            </div>
            <div className="text-xs text-gray-500" title={email}>
              {email || '—'}
            </div>
          </div>
          <button
            type="button"
            className="auth-button"
            onClick={doLogout}
            style={{ width: 'auto', padding: '8px 12px' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}