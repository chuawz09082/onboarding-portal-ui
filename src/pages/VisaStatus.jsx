import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import VisaStatusSection from '../components/VisaStatusSection';
import FileUploadSection from '../components/FileUploadSection';
import DocumentListSection from '../components/DocumentListSection';
import Breadcrumb from '../components/Breadcrumb'; // optional, if you use it elsewhere

import { fetchVisaStatus } from '../redux/visaStatusSlice';
import { getToken, parseJwt } from '../lib/jwt';
import '../App.css';

export default function VisaStatus() {
  const dispatch = useDispatch();

  // Try to prefill employeeId from the JWT "sub" (your backend sets sub = userId)
  const token = getToken();
  const subFromJwt = (parseJwt(token)?.sub || '').toString();

  const [employeeId, setEmployeeId] = useState(subFromJwt);
  const [currentVisaType, setCurrentVisaType] = useState('');

  const statusList = useSelector((s) => s.visaStatus?.statusList || []);

  // Load visa status when we have an employeeId
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchVisaStatus(employeeId));
    }
  }, [dispatch, employeeId]);

  // Determine current active visa type
  useEffect(() => {
    if (statusList.length > 0) {
      const active = statusList.find(v => v.active_flag) || statusList[0];
      if (active) setCurrentVisaType(active.visa_type);
    }
  }, [statusList]);

  return (
    <>
      <Breadcrumb items={[{ label: 'Visa Status', href: '/visa-status' }]} />
      <br />

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Visa Status Management</h1>

        {/* For testing: allow override if needed */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 mr-2">Employee ID:</label>
          <input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            className="border text-black border-gray-300 rounded-lg px-3 py-2"
          />
          <span className="text-xs text-gray-500 ml-2">(defaults from JWT)</span>
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