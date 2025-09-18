import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VisaStatusSection from '../components/VisaStatusSection';
import FileUploadSection from '../components/FileUploadSection';
import DocumentListSection from '../components/DocumentListSection';
import Breadcrumb from '../components/Breadcrumb';
import { fetchVisaStatus, clearVisaError } from '../redux/visaStatusSlice';
import { getToken, parseJwt } from '../lib/jwt';
import API from '../lib/http';
import '../App.css';

export default function VisaStatus() {
  const dispatch = useDispatch();

  const [employeeId, setEmployeeId] = useState('');
  const [lookupError, setLookupError] = useState('');
  const { statusList = [], loading, error } = useSelector((s) => s.visaStatus);
  const [currentVisaType, setCurrentVisaType] = useState('');

  // Resolve employee_id from JWT sub (user_id)
  useEffect(() => {
    const token = getToken();
    const sub = (parseJwt(token)?.sub || '').toString();
    if (!sub) { setLookupError('Not signed in.'); return; }

    (async () => {
      try {
        setLookupError('');
        const url8083 = `http://localhost:8083/employee-service/api/employees/by-user/${encodeURIComponent(sub)}`;
const { data } = await API.get(url8083);
        const empId = data?.employee_id || data?.employeeId || data?.id || '';
        if (empId) setEmployeeId(empId);
        else setLookupError('Employee record not found for your account.');
      } catch (e) {
        const msg =
          e?.response?.status === 404
            ? 'Employee record not found for your account.'
            : e?.response?.status === 401
            ? 'Your session is invalid or expired. Please sign in again.'
            : 'Could not look up your employee record.';
        setLookupError(msg);
      }
    })();
  }, []);

  // Fetch visa status once we have employeeId
  useEffect(() => {
    if (!employeeId) return;
    dispatch(clearVisaError());
    dispatch(fetchVisaStatus(employeeId));
  }, [dispatch, employeeId]);

  // Pick current visa type
  useEffect(() => {
    if (Array.isArray(statusList) && statusList.length > 0) {
      const active = statusList.find((v) => v.active_flag) || statusList[0];
      setCurrentVisaType(active?.visa_type || '');
    } else {
      setCurrentVisaType('');
    }
  }, [statusList]);

  return (
    <>
      <Breadcrumb items={[{ label: 'Visa Status', href: '/visa-status' }]} />
      <br />

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Visa Status Management</h1>

        {/* One banner area (lookup error first, then visa error) */}
        {(lookupError || error) && (
          <div
            role="alert"
            className="mb-3 border border-red-200 bg-red-50 text-red-700 rounded px-3 py-2 text-sm"
          >
            {lookupError || String(error)}
          </div>
        )}

        {/* Read-only employee_id */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 mr-2">Employee ID:</label>
          <input
            value={employeeId}
            readOnly
            placeholder="Resolving your employee record…"
            className="border text-black border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {loading && <div className="mb-3 text-sm text-gray-600">Loading…</div>}

        {employeeId ? (
          <>
            <VisaStatusSection employeeId={employeeId} />
            <div className="my-6" />
            <FileUploadSection employeeId={employeeId} currentVisaType={currentVisaType} />
            <div className="my-6" />
            <DocumentListSection employeeId={employeeId} />
          </>
        ) : (
          !lookupError && <p className="text-gray-600">We’re locating your employee record…</p>
        )}
      </div>
    </>
  );
}