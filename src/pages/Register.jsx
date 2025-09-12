import { useEffect, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import '../App.css';

const AUTH = import.meta.env.VITE_AUTH_BASE || '';

export default function Register() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const token = sp.get('token') || '';
  const [valid, setValid] = useState(null);   // null | true | false
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // No token → back to login
  if (!token) return <Navigate to="/login" replace />;

  // Validate the registration token
  useEffect(() => {
    let ignore = false;
    fetch(`${AUTH}/register/validate?token=${encodeURIComponent(token)}`)
      .then(r => { if (!ignore) setValid(r.ok); })
      .catch(() => { if (!ignore) setValid(false); });
    return () => { ignore = true; };
  }, [token]);

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
    const body = {
      username: String(fd.get('username') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      password: String(fd.get('password') || '')
    };

    try {
      const res = await fetch(`${AUTH}/register?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error((await res.text()) || 'Registration failed');
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
        <h1 style={{ margin: '0 0 16px', fontSize: 36, lineHeight: 1.1 }}>
          Create your account
        </h1>

        <input
          className="auth-input"
          name="username"
          required
          minLength={5}
          placeholder="Username (min 5)"
        />
        <input
          className="auth-input"
          name="email"
          type="email"
          required
          placeholder="Email"
        />
        <input
          className="auth-input"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password (min 8)"
        />

        <button className="auth-button" type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Register'}
        </button>

        {err && <p style={{ color: 'crimson', marginTop: 10 }}>{err}</p>}
      </form>
    </div>
  );
}











































































































































































