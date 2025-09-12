import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HROnly from '../components/HROnly';
import { getToken, isHR,getUsername } from '../lib/jwt';
import API from '../lib/http';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/store/authSlice';
import '../App.css';

export default function Onboarding() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const username = getUsername();

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
    <div className="auth-layout">
      <div className="auth-card">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
          <h1 style={{margin:0, fontSize:36, lineHeight:1.1}}>Onboarding</h1>
          <button className="auth-button" onClick={doLogout} style={{width:'auto', padding:'8px 12px'}}>Logout</button>
        </div>
        <p style={{color:'#666', marginTop:0}}>Welcome! This is the HR personal info page for <strong>{username || 'user'}</strong>.</p>

        <hr style={{ margin: '16px 0', border: 0, borderTop: '1px solid #eee' }} />

        {/* HR-only */}
        <HROnly fallback={null}>
          <HRTools />
        </HROnly>
      </div>
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
    } finally { setBusy(false); }
  }

  async function copyLink() {
    if (!out) return;
    try { await navigator.clipboard.writeText(out); alert('Copied!'); } catch {}
  }

  return (
    <section>
      <h3 style={{margin:'8px 0 6px'}}>HR Tools: Generate registration link</h3>
      <p style={{ color:'#666', marginTop:0 }}>Optional email to prefill the invite.</p>

      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <input
          className="auth-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="newhire@example.com"
          style={{ margin:0 }}
        />
        <button className="auth-button" onClick={genLink} disabled={busy} style={{ width:'auto', whiteSpace:'nowrap' }}>
          {busy ? 'Creating…' : 'Create registration link'}
        </button>
      </div>

      {err && <p style={{ color:'crimson', marginTop:10 }}>{err}</p>}

      {out && (
        <>
          <p style={{ marginTop:12 }}>Link:</p>
          <pre style={{ background:'#f6f8fa', padding:'.75rem', borderRadius:8, overflow:'auto' }}>
            <a href={out} target="_blank" rel="noreferrer">{out}</a>
          </pre>
          <button className="auth-button" onClick={copyLink} style={{ width:'auto' }}>Copy</button>
        </>
      )}
    </section>
  );


}

