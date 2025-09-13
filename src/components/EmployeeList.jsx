import { useState } from 'react';
import Breadcrumb from './Breadcrumb';

const EmployeeList = ({ onSelectEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample employee data on the schema
  const employeesData = [
    {
      id: 'emp_001',
      employee_id: 'mongo_emp_001',
      first_name: 'Sarah',
      last_name: 'Johnson',
      preferred_name: 'Sarah',
      email: 'sarah.johnson@company.com',
      cell_phone: '+1-555-0123',
      position: 'Team Manager',
      department: 'Engineering',
      start_date: '2022-01-10',
      address: [
        {
          address_line1: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
        },
      ],
      visa_status: [{ visa_type: 'H1B', active_flag: true }],
    },
    {
      id: 'emp_002',
      employee_id: 'mongo_emp_002',
      first_name: 'Michael',
      last_name: 'Chen',
      preferred_name: 'Mike',
      email: 'michael.chen@company.com',
      cell_phone: '+1-555-0124',
      position: 'Software Engineer',
      department: 'Engineering',
      start_date: '2023-03-15',
      address: [
        { address_line1: '456 Oak Ave', city: 'Palo Alto', state: 'CA' },
      ],
      visa_status: [{ visa_type: 'H1B', active_flag: true }],
    },
    {
      id: 'emp_003',
      employee_id: 'mongo_emp_003',
      first_name: 'Emily',
      last_name: 'Rodriguez',
      preferred_name: 'Emily',
      email: 'emily.rodriguez@company.com',
      cell_phone: '+1-555-0125',
      position: 'Product Designer',
      department: 'Design',
      start_date: '2021-08-22',
      address: [
        { address_line1: '789 Pine St', city: 'San Jose', state: 'CA' },
      ],
      visa_status: [{ visa_type: 'Green Card', active_flag: true }],
    },
    {
      id: 'emp_004',
      employee_id: 'mongo_emp_004',
      first_name: 'David',
      last_name: 'Kim',
      preferred_name: 'David',
      email: 'david.kim@company.com',
      cell_phone: '+1-555-0126',
      position: 'Data Analyst',
      department: 'Analytics',
      start_date: '2020-11-01',
      address: [
        { address_line1: '321 Cedar Rd', city: 'Mountain View', state: 'CA' },
      ],
      visa_status: [{ visa_type: 'F1 OPT', active_flag: true }],
    },
  ];

  // Breadcrumb items for employee list
  const breadcrumbItems = [{ label: 'Employees', href: '/employee' }];

  // Filter employees based on search term
  const filteredEmployees = employeesData.filter((employee) =>
    `${employee.first_name} ${employee.last_name} ${employee.preferred_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
    <>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      <br />
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {filteredEmployees.length} Employees
            </h1>
          </div>
        </div>
        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search employees by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <br />
        {/* Employee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              {/* Employee Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(employee.first_name, employee.last_name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                  </div>
                  {/* Visa Status Badge */}
                  <div className="flex items-center mb-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVisaStatusColor(
                        employee.visa_status[0]?.visa_type
                      )}`}
                    >
                      {employee.visa_status[0]?.visa_type}
                    </span>
                  </div>
                </div>
              </div>
              {/* Employee Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {employee.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {employee.cell_phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {employee.department}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onSelectEmployee(employee)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
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
              No employees found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Try adjusting your search term.'
                : 'No employees have been added yet.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeList;
