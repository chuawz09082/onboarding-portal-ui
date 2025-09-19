import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import applicationService from '../services/applicationService';

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const list = await applicationService.getAll();
        if (active) setApplications(list);
      } catch {
        if (active) setError('Failed to load applications');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Filter applications based on search term and filters (same as Application page)
  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      (application.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (application.comment || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (application.awf_id || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || application.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || application.application_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'NEW_HIRE':
        return 'bg-purple-100 text-purple-800';
      case 'VISA':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Onboarding Portal</h1>
        <p className="text-gray-600">Track and manage employee applications and onboarding processes.</p>
      </div>

      {/* Application Tracking (same layout as Application page) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Application Tracking</h2>
            {!loading && (
              <p className="text-sm text-gray-600 mt-1">
                {filteredApplications.length} applications found
              </p>
            )}
          </div>
        </div>
        {loading && (
          <div className="text-gray-600">Loading applications...</div>
        )}
        {error && (
          <div className="text-red-600 text-sm mb-3">{error}</div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border text-gray-700 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="OPEN">Open</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border text-gray-700 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value="NEW_HIRE">New Hire</option>
            <option value="VISA">Visa</option>
          </select>
        </div>

        {/* Application list like Application page */}
        <div className="space-y-3">
          {filteredApplications.map((application) => (
            <div
              key={application.awf_id}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="text-gray-900 font-medium">{application.legal_full_name || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(application.application_type)}`}>
                    {application.application_type?.replace('_', ' ') || '—'}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Last Modified</div>
                  <div className="text-gray-900 text-sm">{formatDate(application.last_modification_date)}</div>
                </div>
              </div>
              <div className="mt-3 sm:mt-0">
                <button
                  onClick={() => navigate(`/application/${encodeURIComponent(application.awf_id)}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Application
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!loading && filteredApplications.length === 0) && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M34 34l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                ? 'Try adjusting your search criteria.'
                : 'No applications have been submitted yet.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
