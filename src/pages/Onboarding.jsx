import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HROnly from '../components/HROnly';
import { getToken, isHR } from '../lib/jwt';
import API from '../lib/http';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/store/authSlice';

export default function Onboarding() {
  const nav = useNavigate();
  const dispatch = useDispatch();
function doLogout() {
  dispatch(logout());
  nav('/login', { replace: true });
}

  useEffect(() => {
    const t = getToken();
    if (!t) {
      nav('/login', { replace: true });
    } else if (!isHR(t)) {
      nav('/personal-info', { replace: true });
    }
  }, [nav]);

  return (
    <div style={{ maxWidth: 700, margin: '3rem auto' }}>
    <button onClick={doLogout} style={{ float:'right' }}>Logout</button>
      <h2>Onboarding</h2>
      <p>Protected area. Replace this with your form.</p>

      <hr style={{ margin: '2rem 0' }} />

      <HROnly fallback={null}>
        <HRTools />
      </HROnly>

    </div>
  );
}

function HRTools() {
  const [email, setEmail] = useState('');
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function genLink() {
    try {
      setBusy(true);
      setErr('');
      setOut('');
      const r = await API.post('/hr/registration-token', null, {
        params: email.trim() ? { email: email.trim() } : {},
        responseType: 'text',
        validateStatus: () => true
      });
      if (r.status === 200) setOut(r.data);
      else if (r.status === 401) { sessionStorage.removeItem('access_token'); window.location.href = '/login'; }
      else if (r.status === 403) setErr('Forbidden: you do not have HR permissions.');
      else setErr(`${r.status} ${r.statusText}\n${r.data || ''}`);
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    if (!out) return;
    try { await navigator.clipboard.writeText(out); alert('Copied!'); } catch {}
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>HR Tools: Generate registration link</h3>
      <p style={{ color: '#666' }}>Optional email to prefill the invite.</p>
      <input value={email} onChange={e => setEmail(e.target.value)}
             placeholder="newhire@example.com" style={{ padding: '.5rem', marginRight: '.5rem', width: '60%' }} />
      <button onClick={genLink} disabled={busy}>{busy ? 'Creating…' : 'Create registration link'}</button>
      {err && <p style={{ color: 'crimson', marginTop: '1rem' }}>{err}</p>}
      {out && <>
        <p style={{ marginTop: '1rem' }}>Link:</p>
        <pre style={{ background: '#f6f8fa', padding: '.75rem', borderRadius: 8, overflow: 'auto' }}>{out}</pre>
        <button onClick={copyLink}>Copy</button>
      </>}
    </div>
  );
}




































































































































































