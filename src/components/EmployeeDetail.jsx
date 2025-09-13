import React from 'react';
import Breadcrumb from './Breadcrumb';

function EmployeeDetail({ employee }) {
  // Breadcrumb items for employee detail
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Employees', href: '/employees' },
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
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
