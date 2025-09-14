import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import { employeesData } from '../data/employeesData';

function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the employee by ID
  const employee = employeesData.find(emp => emp.id === id);

  // If employee not found, show error message
  if (!employee) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Employees', href: '/employee' }]} />
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Employee not found
          </h3>
          <p className="text-gray-600 mb-4">
            The employee you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/employee')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  // Breadcrumb items for employee detail
  const breadcrumbItems = [
    { label: 'Employees', href: '/employee' },
    {
      label: `${employee.first_name} ${employee.last_name}`,
      href: `/employee/${employee.id}`,
    },
  ];

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getVisaStatusColor = (visaType) => {
    switch (visaType) {
      case 'H1B':
        return 'bg-blue-100 text-blue-800';
      case 'Green Card':
        return 'bg-green-100 text-green-800';
      case 'F1 OPT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Employee Profile Summary Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {getInitials(employee.first_name, employee.last_name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{employee.position}</p>
              <p className="text-md text-gray-500">{employee.department}</p>
              <div className="mt-2">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getVisaStatusColor(
                    employee.visa_status[0]?.visa_type
                  )}`}
                >
                  {employee.visa_status[0]?.visa_type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Employee Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-900">{employee.email}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-900">{employee.cell_phone}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-900">
                {employee.address[0]?.address_line1}, {employee.address[0]?.city}, {employee.address[0]?.state}
              </span>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Employment Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Employee ID</label>
              <p className="text-gray-900">{employee.employee_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Position</label>
              <p className="text-gray-900">{employee.position}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="text-gray-900">{employee.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <p className="text-gray-900">{new Date(employee.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Preferred Name</label>
              <p className="text-gray-900">{employee.preferred_name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
