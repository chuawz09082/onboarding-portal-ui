import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../lib/jwt';

export default function PrivateRoute() {
  const reduxToken = useSelector((s) => s.auth.token);
  const token = reduxToken || getToken();   // <— fallback to storage
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}



