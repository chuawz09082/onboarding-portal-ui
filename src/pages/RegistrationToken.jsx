import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, isHR, getUsername } from '../lib/jwt';
import API from '../lib/http';
import Breadcrumb from '../components/Breadcrumb';            // adjust path if needed

export default function RegistrationToken() {
  const t = getToken();
  if (!t) return <Navigate to="/login" replace />;
  if (!isHR(t)) return <Navigate to="/personal-info" replace />;

  const username = getUsername();

  return (
    <>
      {/* Breadcrumb like teammates’ pages */}
      <Breadcrumb items={[
        { label: 'Application', href: '/application' },
        { label: 'Registration Link', href: '/registration-token' },
      ]} />
      <br />

      {/* Left-aligned card (no auth-layout/auth-card) */}
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate registration link</h1>
            <p className="text-sm text-gray-600 mt-1">
              Email required for the invite
            </p>
          </div>
        </div>

        <HRTools />
      </div>
    </>
  );
}

function HRTools() {
  const [email, setEmail] = useState('');
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  async function genLink() {
    const e = email.trim();
    if (!e) { setErr('Email is required'); setOut(''); return; }
    if (!emailOk(e)) { setErr('Invalid email'); setOut(''); return; }

    try {
      setBusy(true); setErr(''); setOut('');
      const r = await API.post('/hr/registration-token', null, {
        params: { email: e },
        responseType: 'text',
        validateStatus: () => true,
      });

      if (r.status === 200) {
        setOut(r.data);
      } else if (r.status === 401) {
        sessionStorage.removeItem('access_token');
        window.location.href = '/login';
      } else if (r.status === 403) {
        setErr('Forbidden: you do not have HR permissions.');
      } else {
        const msg = (typeof r.data === 'string' && r.data.trim())
          ? r.data.trim()
          : 'Something went wrong. Please try again.';
        setErr(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    if (!out) return;
    try { await navigator.clipboard.writeText(out); alert('Copied!'); } catch {}
  }

  return (
    <>
      {/* Inline form, not centered */}
      <div className="flex items-center gap-3 max-w-xl">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="newhire@example.com"
          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={genLink}
          disabled={busy}
          type="button"
          className="auth-button"
          style={{ width: 'auto', padding: '8px 12px' }}
        >
          {busy ? 'Creating…' : 'Create registration link'}
        </button>
      </div>

      {err && <p className="text-sm text-red-600 mt-3">{err}</p>}

      {out && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
          <div className="flex items-center gap-3">
            <a href={out} target="_blank" rel="noreferrer"
               className="truncate text-blue-600 underline max-w-xl">
              {out}
            </a>
            <button
              onClick={copyLink}
              type="button"
              className="auth-button"
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </>
  );
}