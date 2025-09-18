import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import VisaStatusSection from '../components/VisaStatusSection';
import FileUploadSection from '../components/FileUploadSection';
import DocumentListSection from '../components/DocumentListSection';
import Breadcrumb from '../components/Breadcrumb';

import { fetchVisaStatus, clearVisaError } from '../redux/visaStatusSlice';
import { getToken, parseJwt } from '../lib/jwt';
import '../App.css';

export default function VisaStatus() {
  const dispatch = useDispatch();

  // NOTE: subFromJwt is a userId (UUID). If your backend expects employee_id
  // (e.g., mongo_emp_001), you can overwrite the box manually or resolve it
  // before calling fetchVisaStatus.
  const token = getToken();
  const subFromJwt = (parseJwt(token)?.sub || '').toString();

  const [employeeId, setEmployeeId] = useState(subFromJwt);
  const { statusList = [], loading, error } = useSelector(s => s.visaStatus);
  const [currentVisaType, setCurrentVisaType] = useState('');

  // When employeeId changes, clear any prior error and fetch
  useEffect(() => {
    if (!employeeId) return;
    dispatch(clearVisaError());
    dispatch(fetchVisaStatus(employeeId));
  }, [dispatch, employeeId]);

  // Determine current active visa type from fetched data
  useEffect(() => {
    if (Array.isArray(statusList) && statusList.length > 0) {
      const active = statusList.find(v => v.active_flag) || statusList[0];
      if (active?.visa_type) setCurrentVisaType(active.visa_type);
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

        {/* Friendly status area */}
        {loading && (
          <div className="mb-3 text-sm text-gray-600">Loading…</div>
        )}
        {error && (
          <div
            role="alert"
            className="mb-3 border border-red-200 bg-red-50 text-red-700 rounded px-3 py-2 text-sm"
          >
            {error}
          </div>
        )}

        {/* For testing: allow override of the ID */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 mr-2">Employee ID:</label>
          <input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            className="border text-black border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {employeeId ? (
          <>
            <VisaStatusSection employeeId={employeeId} />
            <div className="my-6" />
            <FileUploadSection employeeId={employeeId} currentVisaType={currentVisaType} />
            <div className="my-6" />
            <DocumentListSection employeeId={employeeId} />
          </>
        ) : (
          <p className="text-gray-600">Enter an employee ID to load data.</p>
        )}
      </div>
    </>
  );
}