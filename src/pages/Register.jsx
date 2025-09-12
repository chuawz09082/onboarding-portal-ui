import { useEffect, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';

const AUTH = import.meta.env.VITE_AUTH_BASE || '';

export default function Register() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const token = sp.get('token') || '';
  const [valid, setValid] = useState(null); // null | true | false

  // If no token at all -> go to login
  if (!token) return <Navigate to="/login" replace />;

  useEffect(() => {
    fetch(`${AUTH}/register/validate?token=${encodeURIComponent(token)}`)
      .then(r => setValid(r.ok))
      .catch(() => setValid(false));
  }, [token]);

  // If token bad -> go to login
  if (valid === false) return <Navigate to="/login" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      username: String(fd.get('username')||''),
      email: String(fd.get('email')||''),
      password: String(fd.get('password')||'')
    };
    const res = await fetch(`${AUTH}/register?token=${encodeURIComponent(token)}`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
    });
    if (!res.ok) { alert(await res.text()); return; }
    nav('/login');
  }

  if (valid === null) return <p style={{margin:'3rem'}}>Validating link…</p>;

  return (
    <form onSubmit={onSubmit} style={{maxWidth:520,margin:'3rem auto'}}>
      <h2>Create your account</h2>
      <input name="username" required minLength={5} placeholder="Username (min 5)" style={i}/>
      <input name="email" type="email" required placeholder="Email" style={i}/>
      <input name="password" type="password" required minLength={8} placeholder="Password (min 8)" style={i}/>
      <button type="submit">Register</button>
    </form>
  );
}
const i = { display:'block', margin:'8px 0', padding:'8px', width:'100%' };










































