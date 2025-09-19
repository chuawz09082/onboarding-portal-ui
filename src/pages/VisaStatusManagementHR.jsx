import { useEffect, useMemo, useState } from 'react';
import {
  fetchAllEmployees, fetchVisaStatusByEmployee, fetchDocs,
  docPreviewUrl, docDownloadUrl, approveStemOpt, rejectStemOpt
} from '../lib/hrVisaApi';
import { getToken } from '../lib/jwt';

function Pill({ children, tone='default' }) {
  const cls = {
    default: 'bg-gray-200 text-gray-800',
    good:    'bg-green-200 text-green-900',
    warn:    'bg-yellow-200 text-yellow-900',
    bad:     'bg-red-200 text-red-900',
    info:    'bg-blue-200 text-blue-900',
  }[tone] || 'bg-gray-200 text-gray-800';
  return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${cls}`}>{children}</span>;
}

function parseDate(d) {
  if (!d) return null;
  try { return new Date(d); } catch { return null; }
}
function daysBetween(a, b) {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000*60*60*24));
}
function toneDays(n) {
  if (n == null || Number.isNaN(n)) return 'default';
  if (n < 0) return 'bad';
  if (n <= 30) return 'warn';
  return 'good';
}

// Try to pick current visa from your array shape:
function pickCurrentVisa(visaList) {
  if (!Array.isArray(visaList) || visaList.length === 0) return null;
  const active = visaList.find(v => v.active_flag || v.active === true);
  return active || visaList[0];
}
function pluckExpiry(v) {
  return v?.expiration_date || v?.expire_date || v?.endDate || v?.end_date || null;
}
function pluckType(v) {
  return v?.visa_type || v?.type || v?.workAuthorization || null;
}

export default function VisaStatusManagementHR() {
  const token = getToken();
  const [rows, setRows] = useState(null); // null = loading
  const [err, setErr]   = useState('');
  const [docsFor, setDocsFor] = useState(null); // employeeId
  const [docs, setDocs] = useState([]);
  const [canUseHrActions, setCanUseHrActions] = useState(true); // flip to false if 404 on action endpoints
  const [action, setAction] = useState(null); // { employeeId, type: 'approve'|'reject' }
  const [comment, setComment] = useState('');

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setErr(''); setRows(null);
        const emps = await fetchAllEmployees({ token, signal: ac.signal });

        // Build overview with N+1 calls (fine for MVP; backend aggregation later)
        const out = [];
        for (const e of emps) {
          const employeeId = e.employeeId || e.id || e.employee_id;
          if (!employeeId) continue;

          let visa = null, docs = [];
          try { visa = await fetchVisaStatusByEmployee({ employeeId, token, signal: ac.signal }); } catch {}
          try { docs = await fetchDocs({ employeeId, token, signal: ac.signal }); } catch {}

          const current = pickCurrentVisa(visa?.visaStatus || visa?.visa_status || visa);
          const expStr  = pluckExpiry(current);
          const expDate = parseDate(expStr);
          const daysLeft = expDate ? daysBetween(new Date(), expDate) : null;

          // naive STEM-OPT detection: adjust to your data (you can switch to AWF later)
          const stemState = (current?.visa_type || current?.type || '').toUpperCase().includes('STEM')
            ? (current?.status || 'PENDING').toUpperCase()
            : null;

          out.push({
            employeeId,
            fullName: e.fullName || e.preferredName || `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim(),
            workAuth: pluckType(current) || '-',
            expirationDate: expStr || '-',
            daysLeft,
            activeStemOpt: stemState ? {
              state: stemState,
              canApprove: true, // tentative; will be disabled globally if HR endpoints missing
              canReject: true
            } : null,
            docCount: Array.isArray(docs) ? docs.length : 0,
          });
        }

        // Soonest expiry first
        out.sort((a,b) => (a.daysLeft ?? 9e9) - (b.daysLeft ?? 9e9));
        setRows(out);
      } catch (e) {
        setErr(e.message || 'Failed to load');
        setRows([]);
      }
    })();
    return () => ac.abort();
  }, [token]);

  async function refresh() {
    // simplest: reload the page list
    setRows(null); setErr('');
    try {
      const click = new Event('refresh'); // noop hook
      window.dispatchEvent(click);
      // re-run effect by toggling a key? For brevity, just call location.reload in dev:
      location.reload();
    } catch {}
  }

  async function doApprove() {
    if (!action) return;
    try {
      await approveStemOpt({ employeeId: action.employeeId, token });
      setAction(null);
      await refresh();
    } catch (e) {
      if (String(e.message).includes('HTTP_404')) setCanUseHrActions(false);
      setAction(null);
    }
  }
  async function doReject() {
    if (!action) return;
    try {
      await rejectStemOpt({ employeeId: action.employeeId, comment, token });
      setAction(null); setComment('');
      await refresh();
    } catch (e) {
      if (String(e.message).includes('HTTP_404')) setCanUseHrActions(false);
      setAction(null); setComment('');
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-1">Visa Status Management</h1>
      <p className="text-sm text-gray-600 mb-3">
        Track all employees’ work authorization, expirations, documents, and manage visa decisions.
      </p>

      {err && <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 rounded p-2 mb-3">{err}</div>}

      {rows === null && <div>Loading…</div>}
      {Array.isArray(rows) && rows.length === 0 && <div className="bg-gray-100 rounded p-2">No data.</div>}

      {Array.isArray(rows) && rows.length > 0 && (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Work Authorization</th>
                <th className="px-3 py-2 text-left">Expiration</th>
                <th className="px-3 py-2 text-left">Days Left</th>
                <th className="px-3 py-2 text-left">STEM-OPT</th>
                <th className="px-3 py-2 text-left">Actions</th>
                <th className="px-3 py-2 text-left">Documents</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.employeeId} className="border-t">
                  <td className="px-3 py-2">{r.fullName || r.employeeId}</td>
                  <td className="px-3 py-2">{r.workAuth}</td>
                  <td className="px-3 py-2">{r.expirationDate}</td>
                  <td className="px-3 py-2"><Pill tone={toneDays(r.daysLeft)}>{r.daysLeft ?? '-'}</Pill></td>
                  <td className="px-3 py-2">
                    {r.activeStemOpt?.state ? <Pill tone={r.activeStemOpt.state === 'APPROVED' ? 'good' : r.activeStemOpt.state === 'REJECTED' ? 'bad' : 'info'}>{r.activeStemOpt.state}</Pill> : 'NONE'}
                  </td>
                  <td className="px-3 py-2 space-x-2">
                    {r.activeStemOpt?.state ? (
                      <>
                        <button
                          disabled={!canUseHrActions}
                          className={`px-2 py-1 rounded text-white ${canUseHrActions ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                          onClick={() => setAction({ employeeId: r.employeeId, type: 'approve' })}
                        >Approve</button>
                        <button
                          disabled={!canUseHrActions}
                          className={`px-2 py-1 rounded text-white ${canUseHrActions ? 'bg-red-600' : 'bg-gray-400 cursor-not-allowed'}`}
                          onClick={() => setAction({ employeeId: r.employeeId, type: 'reject' })}
                        >Reject</button>
                      </>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <button className="px-2 py-1 rounded bg-blue-600 text-white" onClick={async () => {
                      setDocsFor(r.employeeId); setDocs([]);
                      try { setDocs(await fetchDocs({ employeeId: r.employeeId, token })); } catch { setDocs([]); }
                    }}>
                      View ({r.docCount ?? 0})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Docs drawer */}
      {docsFor && (
        <div className="fixed inset-0 bg-black/40 flex">
          <div className="ml-auto bg-white w-[520px] h-full p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Documents — {docsFor}</h2>
              <button className="text-gray-500" onClick={() => { setDocsFor(null); setDocs([]); }}>✕</button>
            </div>
            {docs.length === 0 ? <div className="text-sm text-gray-600">No documents.</div> : (
              <ul className="space-y-2">
                {docs.map((d, i) => (
                  <li key={d.id || i} className="border rounded p-2">
                    <div className="font-medium">{d.title || d.path}</div>
                    <div className="text-xs text-gray-600">{d.comment || ''}</div>
                    <div className="text-xs text-gray-500">{d.create_date || ''}</div>
                    <div className="mt-2 space-x-2">
                      <a className="px-2 py-1 bg-gray-200 rounded" href={docPreviewUrl(d.path)} target="_blank" rel="noreferrer">Preview</a>
                      <a className="px-2 py-1 bg-gray-200 rounded" href={docDownloadUrl(d.path)} target="_blank" rel="noreferrer">Download</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex-1" onClick={() => { setDocsFor(null); setDocs([]); }} />
        </div>
      )}

      {/* Approve/Reject modal */}
      {action && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-3">
          <div className="bg-white rounded-lg max-w-md w-full p-4">
            <h3 className="text-lg font-semibold mb-2">
              {action.type === 'approve' ? 'Approve STEM-OPT application?' : 'Reject STEM-OPT application?'}
            </h3>
            {action.type === 'reject' && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Comment (optional)</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Reason for rejection"
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => { setAction(null); setComment(''); }}>Cancel</button>
              {action.type === 'approve' ? (
                <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={doApprove}>Approve</button>
              ) : (
                <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={doReject}>Reject</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}