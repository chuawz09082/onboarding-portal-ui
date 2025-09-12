import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import API from '../lib/http';
import '../App.css';

function parseJwt(t) {
  try { const [,p]=t.split('.'); return JSON.parse(atob(p.replace(/-/g,'+').replace(/_/g,'/'))); }
  catch { return {}; }
}

export default function Register() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const token = sp.get('token') || '';

  const [valid, setValid] = useState(null);   // null | true | false
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState('');

  if (!token) return <Navigate to="/login" replace />;

  // Prefill email from token; not editable per spec
  const prefillEmail = useMemo(() => parseJwt(token)?.email || '', [token]);

  // 1) Validate token (200 OK means valid)
  useEffect(() => {
    let cancel=false;
    (async () => {
      const r = await API.get('/register/validate', { params:{ token }, validateStatus:()=>true });
      if (!cancel) setValid(r.status === 200);
    })().catch(() => !cancel && setValid(false));
    return () => { cancel = true; };
  }, [token]);

  if (valid === false) return <Navigate to="/login" replace />;
  if (valid === null) {
    return <div className="auth-layout"><div className="auth-card"><p>Validating link…</p></div></div>;
  }

  // 2) Submit registration
  async function onSubmit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      username: String(fd.get('username')||'').trim(),
      email:    String(fd.get('email')||'').trim(),
      password: String(fd.get('password')||'')
    };

    try {
      const r = await API.post('/register', body, {
        params: { token },
        validateStatus: () => true
      });

      if (r.status !== 201) {
        // Surface backend message
        const msg = typeof r.data === 'string' ? r.data : (r.data?.message || `HTTP ${r.status}`);
        throw new Error(msg);
      }
      nav('/login', { replace: true });
    } catch (e) {
      setErr(e.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-layout">
      <form onSubmit={onSubmit} className="auth-card">
        <h1 style={{ margin: '0 0 16px', fontSize: 36, lineHeight: 1.1 }}>Create your account</h1>

        <input className="auth-input" name="username" required minLength={5} placeholder="Username (min 5)" />
        <input className="auth-input" name="email" type="email" required placeholder="Email"
               defaultValue={prefillEmail}  />
        <input className="auth-input" name="password" type="password" required minLength={8} placeholder="Password (min 8)" />

        <button className="auth-button" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
        {err && <p style={{ color:'crimson', marginTop:10 }}>{err}</p>}
      </form>
    </div>
  );
}























































































