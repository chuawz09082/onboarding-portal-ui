import '../App.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/store/authSlice';     // adjust path if yours differs
import { getToken,getUsername } from '../lib/jwt';

export default function PersonalInfo() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const username = getUsername();

  function doLogout() {
    dispatch(logout());
    nav('/login', { replace: true });
  }

  // optional guard: if no token, bounce to /login
  useEffect(() => {
    if (!getToken()) nav('/login', { replace: true });
  }, [nav]);

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
          <h1 style={{margin:0, fontSize:36, lineHeight:1.1}}>Personal Info</h1>
          <button className="auth-button" onClick={doLogout} style={{width:'auto', padding:'8px 12px'}}>Logout</button>
        </div>

        <p style={{color:'#666', marginTop:0}}>Welcome! This is the employee personal info page for <strong>{username || 'user'}</strong>.</p>
        {/* TODO: replace with your form */}
      </div>
    </div>
  );
}










