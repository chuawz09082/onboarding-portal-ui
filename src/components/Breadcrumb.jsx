import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumb({ items }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    /* Implement later */
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
          {index > 0 && <span className="text-gray-400">{'>'}</span>}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumb;
