import { useEffect, useMemo, useState } from 'react';
import { getEmployeeByUser, getApplicationWorkflowsByEmployee } from '../lib/employeeApi';
import { getAccessToken, getEmployeeId as readEmployeeId, setEmployeeId as persistEmployeeId } from '../lib/jwt';
import { jwtDecode } from 'jwt-decode';

/* ---------- small UI helpers ---------- */
function Pill({ children, tone = 'default' }) {
  const cls = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-200 text-green-900',
    warn: 'bg-yellow-200 text-yellow-900',
    danger: 'bg-red-200 text-red-900',
    info: 'bg-blue-200 text-blue-900',
  }[tone] || 'bg-gray-200 text-gray-800';
  return <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${cls}`}>{children}</span>;
}

function statusTone(s) {
  const x = (s || '').toUpperCase();
  if (x === 'APPROVED') return 'success';
  if (x === 'REJECTED') return 'danger';
  if (x === 'PENDING' || x === 'IN_PROGRESS' || x === 'SUBMITTED') return 'info';
  return 'default';
}

function subFromToken(t) {
  try { return jwtDecode(t)?.sub || ''; } catch { return ''; }
}

/** Map backend fields -> UI shape */
function normalizeWorkflow(wf) {
  return {
    id: wf.awfId ?? wf.id ?? '-',
    status: wf.status ?? '-',
    stage: wf.applicationType ?? wf.stage ?? wf.step ?? '-',
    updatedAt: wf.lastModificationDate ?? wf.createDate ?? wf.updatedAt ?? wf.createdAt ?? '-',
    remark: wf.comment ?? wf.remark ?? wf.notes ?? '',
  };
}

/* ---------- page ---------- */
export default function ApplicationStatus() {
  const [data, setData] = useState(null); // null = loading, [] = none
  const [unauth, setUnauth] = useState(false); // only show 401 message
  const [employeeId, setEmployeeId] = useState(readEmployeeId() || '');
  const token = getAccessToken();

  const latest = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null;
    return data[0];
  }, [data]);

  useEffect(() => {
    const ac = new AbortController();
    let alive = true;

    (async () => {
      try {
        setUnauth(false);
        setData(null);

        if (!token) { setUnauth(true); setData([]); return; }

        // ensure we have employeeId (employee record id)
        let eid = employeeId;
        if (!eid) {
          const sub = subFromToken(token);
          if (!sub) { setData([]); return; }
          const emp = await getEmployeeByUser({ sub, token, signal: ac.signal });
          if (!emp?.id) { setData([]); return; }
          eid = emp.id;
          if (!alive) return;
          setEmployeeId(eid);
          persistEmployeeId(eid);
        }

        const list = await getApplicationWorkflowsByEmployee({ employeeId: eid, token, signal: ac.signal });
        if (!alive) return;
        setData(Array.isArray(list) ? list.map(normalizeWorkflow) : []);
      } catch (e) {
        // Ignore expected aborts from cleanup/HMR/route changes
        if (e?.name === 'AbortError' || /aborted/i.test(String(e?.message))) return;
        // For any other error, quietly show "no data" (no Heads up)
        if (!alive) return;
        setData([]);
        // Optional: console.debug('ApplicationStatus error:', e);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [token, employeeId]);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Application Status</h1>
      <p style={{ color: '#555', marginBottom: '1rem' }}>Track your onboarding application workflow.</p>

      {unauth && (
        <div style={{ background: '#fdecea', padding: '1rem', borderRadius: 8 }}>
          <strong>401</strong> – Your session has expired. Please sign in.
        </div>
      )}

      {data === null && <p>Loading status…</p>}

      {Array.isArray(data) && data.length === 0 && !unauth && (
        <div style={{ background: '#f6f8fa', padding: '1rem', borderRadius: 8 }}>
          <p>No workflow records yet. If you just submitted, this page will update once HR processes it.</p>
        </div>
      )}

      {latest && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Current Status</h2>
            <Pill tone={statusTone(latest.status)}>{latest.status}</Pill>
          </div>
          <dl style={{ display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: 6, columnGap: 18, marginTop: 10 }}>
            <dt style={{ color: '#555' }}>Workflow ID</dt><dd>{latest.id}</dd>
            <dt style={{ color: '#555' }}>Application Type</dt><dd>{latest.stage}</dd>
            <dt style={{ color: '#555' }}>Updated</dt><dd>{latest.updatedAt}</dd>
            <dt style={{ color: '#555' }}>Comment</dt><dd>{latest.remark || '-'}</dd>
          </dl>
        </div>
      )}

      {Array.isArray(data) && data.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Timeline</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {data.map((wf, i) => (
              <li key={wf.id || i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: '999px', background: '#9ca3af', marginTop: 6 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <strong>{wf.stage}</strong>
                    <Pill tone={statusTone(wf.status)}>{wf.status}</Pill>
                  </div>
                  <div style={{ color: '#555', fontSize: 13, marginTop: 2 }}>{wf.updatedAt}</div>
                  {wf.remark && <div style={{ marginTop: 6 }}>{wf.remark}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}