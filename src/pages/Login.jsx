import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginThunk } from '../redux/store/authSlice';   // <-- import the thunk
import { getToken } from '../lib/jwt';
import '../App.css';

export default function Login() {
  const nav = useNavigate();
  const dispatch = useDispatch();                           // <-- get dispatch
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // If already logged in, skip login page
  useEffect(() => {
    if (getToken()) nav('/onboarding', { replace: true });
  }, [nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await dispatch(loginThunk({ username: username.trim(), password })).unwrap();
      nav('/onboarding', { replace: true });
    } catch (e) {
      console.log('LOGIN ERROR', e);
      setErr(typeof e === 'string' ? e : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-layout">
      <form onSubmit={onSubmit} className="auth-card">
        <h1 style={{ margin: '0 0 16px', fontSize: 44, lineHeight: 1.1 }}>Sign in</h1>

        <input
          className="auth-input"
          placeholder="Username or email"
          value={username}
          onChange={(e) => setU(e.target.value)}
          autoComplete="username"
        />

        <input
          className="auth-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setP(e.target.value)}
          autoComplete="current-password"
        />

        <button className="auth-button" disabled={busy} type="submit">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        {err && <p style={{ color: 'crimson', marginTop: 10 }}>{err}</p>}
      </form>
    </div>
  );
}













































































































































