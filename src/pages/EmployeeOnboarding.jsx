import '../App.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/store/authSlice';
import { getToken, isHR, getUsername } from '../lib/jwt';
import API from '../lib/http';

export default function EmployeeOnboarding() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const username = getUsername();

  // simple model state (expand as you go)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    preferredName: '',
    address: '',
    cellPhone: '',
    workPhone: '',
    email: '',          // read-only, from backend
    ssn: '',
    dob: '',
    gender: '',
    citizenOrPr: '',    // 'CITIZEN', 'GREENCARD', 'NO'
    workAuth: '',       // 'H1-B','L2','F1','H4','OTHER'
    workAuthOther: '',
    workAuthStart: '',
    workAuthEnd: '',
    hasDL: 'NO',        // 'YES' | 'NO'
    dlNumber: '',
    dlExpire: '',
    reference: {
      firstName: '', lastName: '', middleName: '',
      phone: '', address: '', email: '', relationship: ''
    },
    emergency1: { firstName:'', lastName:'', middleName:'', phone:'', email:'', relationship:'' }
  });

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const isCitizenOrPR = useMemo(() => form.citizenOrPr === 'CITIZEN' || form.citizenOrPr === 'GREENCARD', [form.citizenOrPr]);
  const needsWorkAuth = useMemo(() => form.citizenOrPr === 'NO', [form.citizenOrPr]);

  function doLogout() {
    dispatch(logout());
    nav('/login', { replace: true });
  }

  // guard + prefill email/status
  useEffect(() => {
    const t = getToken();
    if (!t) {
      nav('/login', { replace: true });
      return;
    }
    // (optional) HRs should use the HR route
    if (isHR(t)) {
      nav('/hr/onboarding', { replace: true });
      return;
    }

    // prefill from backend
    (async () => {
      try {
        const r = await API.get('/application-service/api/onboarding/me', { validateStatus: () => true });
        if (r.status === 200 && r.data) {
          setForm(f => ({ ...f, email: r.data.email || '' }));
        }
      } catch {
        // ignore for now
      }
    })();
  }, [nav]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }
  function setNested(path, value) {
    setForm(f => {
      const copy = { ...f };
      const segs = path.split('.');
      let obj = copy;
      for (let i = 0; i < segs.length - 1; i++) obj = (obj[segs[i]] = { ...obj[segs[i]] });
      obj[segs[segs.length - 1]] = value;
      return copy;
    });
  }

  function validate() {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Email looks invalid';
    if (!form.cellPhone.trim()) return 'Cell phone is required';
    if (!form.dob.trim()) return 'Date of birth is required';
    if (!form.gender) return 'Please select gender';
    if (needsWorkAuth) {
      if (!form.workAuth) return 'Select a work authorization type';
      if (form.workAuth === 'OTHER' && !form.workAuthOther.trim()) return 'Specify work authorization';
      if (!form.workAuthStart) return 'Work authorization start date required';
      if (!form.workAuthEnd) return 'Work authorization end date required';
    }
    if (form.hasDL === 'YES') {
      if (!form.dlNumber.trim()) return 'Driver’s license number required';
      if (!form.dlExpire) return 'Driver’s license expiration date required';
    }
    // at least one emergency contact minimal check
    if (!form.emergency1.firstName.trim() || !form.emergency1.lastName.trim() || !form.emergency1.phone.trim())
      return 'Emergency contact (first/last/phone) is required';
    return '';
  }

  async function saveDraft(e) {
    e.preventDefault();
    setErr('');
    setOk('');
    const v = validate();
    if (v) { setErr(v); return; }

    try {
      setBusy(true);
      // TODO: replace with your real endpoint once ready
      const r = await API.post(
        '/application-service/api/onboarding/save',
        form,
        { validateStatus: () => true }
      );
      if (r.status >= 200 && r.status < 300) setOk('Saved draft.');
      else setErr('Could not save yet (endpoint not ready).');
    } catch {
      setErr('Network error.');
    } finally { setBusy(false); }
  }

  return (
    <div className="auth-layout">
      <form onSubmit={saveDraft} className="auth-card">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
          <h1 style={{margin:0, fontSize:36, lineHeight:1.1}}>Onboarding Application</h1>
          <button type="button" className="auth-button" onClick={doLogout} style={{width:'auto', padding:'8px 12px'}}>Logout</button>
        </div>
        <p style={{color:'#666', marginTop:0}}>Welcome, <strong>{username || 'user'}</strong>. Please complete the application below.</p>

        {/* ——— Basic Info ——— */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <input className="auth-input" placeholder="First Name *" value={form.firstName} onChange={e=>setField('firstName', e.target.value)} />
          <input className="auth-input" placeholder="Last Name *"  value={form.lastName}  onChange={e=>setField('lastName',  e.target.value)} />
          <input className="auth-input" placeholder="Middle Name"  value={form.middleName} onChange={e=>setField('middleName',e.target.value)} />
          <input className="auth-input" placeholder="Preferred Name" value={form.preferredName} onChange={e=>setField('preferredName',e.target.value)} />
        </div>

        <input className="auth-input" placeholder="Current Address" value={form.address} onChange={e=>setField('address', e.target.value)} />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <input className="auth-input" placeholder="Cell Phone *" value={form.cellPhone} onChange={e=>setField('cellPhone', e.target.value)} />
          <input className="auth-input" placeholder="Work Phone"   value={form.workPhone} onChange={e=>setField('workPhone', e.target.value)} />
        </div>

        <input className="auth-input" placeholder="Email *" value={form.email} readOnly />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          <input className="auth-input" placeholder="SSN" value={form.ssn} onChange={e=>setField('ssn', e.target.value)} />
          <input className="auth-input" type="date" placeholder="Date of Birth *" value={form.dob} onChange={e=>setField('dob', e.target.value)} />
          <select className="auth-input" value={form.gender} onChange={e=>setField('gender', e.target.value)}>
            <option value="">Gender *</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>I Prefer Not to Say</option>
          </select>
        </div>

        {/* ——— Citizenship / Work Auth ——— */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          <select className="auth-input" value={form.citizenOrPr} onChange={e=>setField('citizenOrPr', e.target.value)}>
            <option value="">Are you a citizen or permanent resident?</option>
            <option value="CITIZEN">Citizen</option>
            <option value="GREENCARD">Green Card</option>
            <option value="NO">No</option>
          </select>

          {needsWorkAuth && (
            <select className="auth-input" value={form.workAuth} onChange={e=>setField('workAuth', e.target.value)}>
              <option value="">Work authorization *</option>
              <option>H1-B</option>
              <option>L2</option>
              <option>F1(CPT/OPT)</option>
              <option>H4</option>
              <option value="OTHER">Other</option>
            </select>
          )}

          {needsWorkAuth && form.workAuth === 'OTHER' && (
            <input className="auth-input" placeholder="Specify authorization *" value={form.workAuthOther} onChange={e=>setField('workAuthOther', e.target.value)} />
          )}
        </div>

        {needsWorkAuth && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <input className="auth-input" type="date" placeholder="Start date *" value={form.workAuthStart} onChange={e=>setField('workAuthStart', e.target.value)} />
            <input className="auth-input" type="date" placeholder="End date *"   value={form.workAuthEnd}   onChange={e=>setField('workAuthEnd', e.target.value)} />
          </div>
        )}

        {/* ——— Driver's License ——— */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <select className="auth-input" value={form.hasDL} onChange={e=>setField('hasDL', e.target.value)}>
            <option value="NO">Do you have a driver's license? (Yes/No)</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>

          {form.hasDL === 'YES' && (
            <>
              <input className="auth-input" placeholder="DL Number *" value={form.dlNumber} onChange={e=>setField('dlNumber', e.target.value)} />
              <input className="auth-input" type="date" placeholder="DL Expiration *" value={form.dlExpire} onChange={e=>setField('dlExpire', e.target.value)} />
            </>
          )}
        </div>

        {/* ——— Reference ——— */}
        <h3 style={{ margin:'16px 0 8px' }}>Reference</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
          <input className="auth-input" placeholder="First name" value={form.reference.firstName} onChange={e=>setNested('reference.firstName', e.target.value)} />
          <input className="auth-input" placeholder="Last name"  value={form.reference.lastName}  onChange={e=>setNested('reference.lastName',  e.target.value)} />
          <input className="auth-input" placeholder="Middle name" value={form.reference.middleName} onChange={e=>setNested('reference.middleName', e.target.value)} />
          <input className="auth-input" placeholder="Phone" value={form.reference.phone} onChange={e=>setNested('reference.phone', e.target.value)} />
          <input className="auth-input" placeholder="Address" value={form.reference.address} onChange={e=>setNested('reference.address', e.target.value)} />
          <input className="auth-input" placeholder="Email" value={form.reference.email} onChange={e=>setNested('reference.email', e.target.value)} />
          <input className="auth-input" placeholder="Relationship" value={form.reference.relationship} onChange={e=>setNested('reference.relationship', e.target.value)} />
        </div>

        {/* ——— Emergency Contact (at least one) ——— */}
        <h3 style={{ margin:'16px 0 8px' }}>Emergency Contact *</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
          <input className="auth-input" placeholder="First name *" value={form.emergency1.firstName} onChange={e=>setNested('emergency1.firstName', e.target.value)} />
          <input className="auth-input" placeholder="Last name *"  value={form.emergency1.lastName}  onChange={e=>setNested('emergency1.lastName',  e.target.value)} />
          <input className="auth-input" placeholder="Middle name" value={form.emergency1.middleName} onChange={e=>setNested('emergency1.middleName', e.target.value)} />
          <input className="auth-input" placeholder="Phone *" value={form.emergency1.phone} onChange={e=>setNested('emergency1.phone', e.target.value)} />
          <input className="auth-input" placeholder="Email" value={form.emergency1.email} onChange={e=>setNested('emergency1.email', e.target.value)} />
          <input className="auth-input" placeholder="Relationship" value={form.emergency1.relationship} onChange={e=>setNested('emergency1.relationship', e.target.value)} />
        </div>

        <button className="auth-button" style={{ marginTop:12 }} disabled={busy} type="submit">
          {busy ? 'Saving…' : 'Save draft'}
        </button>

        {err && <p style={{ color:'crimson', marginTop:10 }}>{err}</p>}
        {ok  && <p style={{ color:'#2e7d32', marginTop:10 }}>{ok}</p>}
      </form>
    </div>
  );
}