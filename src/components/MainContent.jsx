import React from 'react';

function MainContent({ children }) {
  return (
    <div className="fixed left-0 top-0 ml-64 mt-18 right-0 bottom-0 bg-gray-50 overflow-y-auto">
      <div className="p-6">{children}</div>
    </div>
  );
}

export default MainContent;
