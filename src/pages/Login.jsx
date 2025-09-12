import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/http';
import { getToken } from '../lib/jwt';

export default function Login() {
  const nav = useNavigate();
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (getToken()) nav('/onboarding', { replace: true });
  }, [nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const res = await API.post('/api/login', { username, password });
      sessionStorage.setItem('access_token', res.data.access_token);
      nav('/onboarding');
    } catch (e) {
      setErr(e?.response?.status === 401 ? 'Invalid credentials' : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: '3rem auto' }}>
      <h1>Sign in</h1>
      <input
        placeholder="Username or email"
        value={username}
        onChange={(e) => setU(e.target.value)}
        autoComplete="username"
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setP(e.target.value)}
        autoComplete="current-password"
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}
      />
      <button disabled={busy} type="submit">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
    </form>
  );
}

























































































