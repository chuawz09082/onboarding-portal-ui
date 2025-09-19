
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getToken, isHR, isEmployeeOnly } from '../lib/jwt';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;


  const token = getToken?.();
  const hr = token && isHR(token);
  const employeeOnly = token && isEmployeeOnly(token);


  // HR-only sections flag (you already had this)
  const showReg = !!(token && hr);


  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col z-10">
        {/* Logo */}
        <div className="p-5 border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">🎯</div>
            <span className="text-xl font-semibold text-gray-800">Onboarding Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {/* Home */}
            <li>
              <Link
                to="/"
                className={`flex items-center space-x-3 px-5 py-1 rounded-full transition-colors ${
                  isActive('/')
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">🏠</span>
                <span className="text-gray-600 hover:text-gray-950 font-medium">Home</span>
              </Link>
            </li>

            {/* Visa Status (hide for HR) */}
            {!hr && (
              <li>
                <Link
                  to="/visa-status"
                  className={`flex items-center space-x-3 px-5 py-1 rounded-full transition-colors ${
                    isActive('/visa-status')
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">🛂</span>
                  <span className="text-gray-600 hover:text-gray-950 font-medium">
                    Visa Status
                  </span>
                </Link>
              </li>
            )}

            {/* Application Status (hide for HR) */}
{!hr && (
  <li>
    <Link
      to="/application/status"
      className={`flex items-center space-x-3 px-5 py-1 rounded-full transition-colors ${
        isActive('/application/status')
          ? 'bg-blue-100 text-blue-600 font-medium'
          : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
      }`}
    >
      <span className="text-lg">📋</span>
      <span className="text-gray-600 hover:text-gray-950 font-medium">
        Application Status
      </span>
    </Link>
  </li>
)}

            {/* Employees (HR-only) */}


            {showReg && (
              <li>
                <Link
                  to="/employee"
                  className={`flex items-center space-x-3 px-5 py-1 rounded-full transition-colors ${
                    isActive('/employee')
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">👥</span>
                  <span className="text-gray-600 hover:text-gray-950 font-medium">Employees</span>
                </Link>
              </li>
            )}

            {/* Registration Token (HR-only) */}

            {showReg && (
              <li>
                <Link
                  to="/registration-token"
                  className={`flex items-center space-x-3 px-5 py-1 rounded-full transition-colors ${
                    isActive('/registration-token')
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">🔗</span>
                  <span className="text-gray-600 hover:text-gray-950 font-medium">Registration Link</span>
                </Link>
              </li>
            )}

                         {/* Visa Status Management( HR) */}
 {showReg && (
   <li>
     <Link
       to="/hr/visa"
       className={`flex items-center space-x-3 px-5 py-1 rounded-full transition-colors ${
         isActive('/hr/visa')
           ? 'bg-blue-100 text-blue-600 font-medium'
           : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
       }`}
     >
       <span className="text-lg">🛂</span>
       <span className="text-gray-600 hover:text-gray-950 font-medium">
         Visa Status Management
       </span>
     </Link>
   </li>
 )}

            {/* Application (HR-only) */}
            {showReg && (
              <li>
                <Link
                  to="/application"
                  className={`flex items-center space-x-3 px-5 py-1 rounded-full transition-colors ${
                    isActive('/application')
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">🔧</span>
                  <span className="text-gray-600 hover:text-gray-950 font-medium">Application</span>
                </Link>
              </li>
            )}

            {/* Housing (HR-only) */}
            {showReg && (
              <li>
                <Link
                  to="/house"
                  className={`flex items-center space-x-3 px-5 py-1 rounded-full transition-colors ${
                    isActive('/housing')
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">📦</span>
                  <span className="text-gray-600 hover:text-gray-950 font-medium">Housing</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
