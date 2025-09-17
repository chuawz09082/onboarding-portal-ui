import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getToken, isHR } from '../lib/jwt'; 

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const showReg = (() => {
        const t = getToken?.();
        return t && isHR(t);
      })();

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col z-10">
        {/* Logo Section*/}
        <div className="p-5 border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              🎯
            </div>
            <span className="text-xl font-semibold text-gray-800">
              Onboarding Portal
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {/* Home bar */}
            <li>
              <Link
                to="/"
                className={`flex items-center space-x-3 px-5 py-1 rounded-full hover:bg-blue-100 transition-colors ${
                  isActive('/')
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">🏠</span>
                <span className="text-gray-600 hover:text-gray-950 font-medium ">
                  Home
                </span>
              </Link>
            </li>
              {/* Visa Status */}
          <li>
             <Link
               to="/visa-status"
               className={`flex items-center space-x-3 px-5 py-1 rounded-full hover:bg-blue-100 transition-colors ${
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
            {/* Employee bar */}
            {showReg && (<li>
              <Link
                to="/employee"
                className={`flex items-center space-x-3 px-5 py-1 rounded-full hover:bg-blue-100 transition-colors ${
                  isActive('/employee')
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">👥</span>
                <span className="text-gray-600 hover:text-gray-950 font-medium">
                  Employees
                </span>
              </Link>
            </li>
            )}
             {/* Registration Token (HR only) */}
             {showReg && (
             <li>
                <Link
                  to="/registration-token"
                  className={`flex items-center space-x-3 px-5 py-1 rounded-full hover:bg-blue-100 transition-colors ${
                    isActive('/registration-token')
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">🔗</span>
                  <span className="text-gray-600 hover:text-gray-950 font-medium">
                    Registration Link
                  </span>
                </Link>
              </li>
            )}
            {/* Application bar */}
            {showReg && (
            <li>
              <Link
                to="/application"
                className={`flex items-center space-x-3 px-5 py-1 rounded-full hover:bg-blue-100 transition-colors ${
                  isActive('/application')
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">🔧</span>
                <span className="text-gray-600 hover:text-gray-950 font-medium">
                  Application
                </span>
              </Link>
            </li>
            )}
            {/* Housing bar */}
            {showReg && (
            <li>
              <Link
                to="/housing"
                className={`flex items-center space-x-3 px-5 py-1 rounded-full hover:bg-blue-100 transition-colors ${
                  isActive('/housing')
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">📦</span>
                <span className="text-gray-600 hover:text-gray-950 font-medium">
                  Housing
                </span>
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
