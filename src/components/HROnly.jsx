import { getToken, isHR } from '../lib/jwt';

export default function HROnly({ children, fallback = null }) {
  const t = getToken();
  return (t && isHR(t)) ? children : fallback;
}