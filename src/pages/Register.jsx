import '../App.css';
import { useEffect, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';             // <— add
import { setToken as setReduxToken } from '../redux/store/authSlice'; // <— add
import API from '../lib/http';

const AUTH = import.meta.env.VITE_AUTH_BASE || '';

export default function Register() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const dispatch = useDispatch();                      // <— add

  const tokenParam = sp.get('token') || '';
  const emailFromLink = sp.get('email') || '';

  const [valid, setValid] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!tokenParam) return <Navigate to="/login" replace />;

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const r = await fetch(`${AUTH}/register/validate?token=${encodeURIComponent(tokenParam)}`);
        if (!ignore) setValid(r.ok);
      } catch {
        if (!ignore) setValid(false);
      }
    })();
    return () => { ignore = true; };
  }, [tokenParam]);

  if (valid === false) return <Navigate to="/login" replace />;
  if (valid === null) {
    return (
      <div className="auth-layout">
        <div className="auth-card"><p>Validating link…</p></div>
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);

    const fd = new FormData(e.currentTarget);
    const username = String(fd.get('username') || '').trim();
    const password = String(fd.get('password') || '');
    const email    = String(emailFromLink || fd.get('email') || '').trim();

    try {
      // 1) Register
      const regRes = await fetch(`${AUTH}/register?token=${encodeURIComponent(tokenParam)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!regRes.ok) throw new Error((await regRes.text()) || 'Registration failed');

      // 2) Auto-login
      let loginRes = await fetch(`${AUTH}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!loginRes.ok) {
        loginRes = await fetch(`${AUTH}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }
      if (!loginRes.ok) { nav('/login?registered=1', { replace: true }); return; }

      // 3) Parse token
      let token = '';
      const ctype = loginRes.headers.get('content-type') || '';
      if (ctype.includes('application/json')) {
        const data = await loginRes.json();
        token = data.access_token || data.token || '';
      } else {
        token = (await loginRes.text()).trim();
      }
      if (!token) throw new Error('No access token returned from login');

      // 4) Persist + set axios + sync Redux
      sessionStorage.setItem('access_token', token);
      localStorage.setItem('access_token', token); // optional
      if (API?.defaults?.headers?.common) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      dispatch(setReduxToken(token));               // <— IMPORTANT

      // 5) Go to onboarding (protected route)
      nav('/onboarding', { replace: true });

    } catch (e) {
      setErr(e.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-layout">
      <form onSubmit={onSubmit} className="auth-card" noValidate>
        <h1 style={{ margin: '0 0 16px', fontSize: 36, lineHeight: 1.1 }}>Create your account</h1>

        <input className="auth-input" name="username" required minLength={5} placeholder="Username (min 5)" />

        {/* Email locked but submitted */}
        <input
          className="auth-input"
          name="email"
          type="email"
          required
          placeholder="Email"
          defaultValue={emailFromLink}
          readOnly
          aria-readonly="true"
          style={{ background: '#f8f9fa', cursor: 'not-allowed' }}
        />

        <input className="auth-input" name="password" type="password" required minLength={8} placeholder="Password (min 8)" />

        <button className="auth-button" type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Register'}
        </button>

        {err && <p style={{ color: 'crimson', marginTop: 10 }}>{err}</p>}
      </form>
    </div>
  );
}

















































































































































