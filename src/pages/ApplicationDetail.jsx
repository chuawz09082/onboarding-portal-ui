import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import applicationService from '../services/applicationService';

export default function ApplicationDetail() {
  const { awfId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [docComments, setDocComments] = React.useState({});

  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await applicationService.getById(awfId);
        if (!active) return;
        setApplication(data);
        const initial = {};
        (data?.documents || []).forEach((d) => { initial[d.id] = d.comment || ''; });
        setDocComments(initial);
      } catch {
        if (active) setError('Failed to load application');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [awfId]);

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
    return new Date(dateString).toLocaleString();
  };

  const breadcrumbItems = [
    { label: 'Applications', href: '/application' },
    { label: awfId, href: `/application/${awfId}` },
  ];

  if (loading) {
    return <div className="bg-white rounded-lg shadow-sm p-6">Loading...</div>;
  }
  if (error || !application) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-red-600 mb-4">{error || 'Application not found.'}</p>
        <button
          onClick={() => navigate('/application')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <br />
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
            <p className="text-sm text-gray-600 mt-1">AWF ID: {application.awf_id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert('Approve action placeholder')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => alert('Reject action placeholder')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Applicant</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-900">{application.legal_full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Employee ID</span>
                <span className="text-gray-900">{application.employee_id}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Application</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(application.application_type)}`}>
                  {application.application_type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900">{formatDate(application.create_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Modified</span>
                <span className="text-gray-900">{formatDate(application.last_modification_date)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Comments</h2>
          <p className="text-gray-900 text-sm">{application.comment}</p>
        </div>

        {/* Documents Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Documents</h2>
            <span className="text-xs text-gray-500">{application.documents?.length || 0} files</span>
          </div>
          {(!application.documents || application.documents.length === 0) ? (
            <p className="text-sm text-gray-600">No documents uploaded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {application.documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{doc.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{doc.type}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{formatDate(doc.uploaded_at)}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={docComments[doc.id] ?? ''}
                            onChange={(e) => setDocComments((prev) => ({ ...prev, [doc.id]: e.target.value }))}
                            placeholder="Add a comment"
                            className="w-56 md:w-72 border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={() => {
                              // Persist to in-memory data for demo purposes
                              doc.comment = docComments[doc.id] ?? '';
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <a href={doc.url} className="text-blue-600 hover:text-blue-700">View</a>
                          <a href={doc.url} download className="text-gray-700 hover:text-gray-900">Download</a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


