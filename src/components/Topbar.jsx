function Topbar() {
  return (
    <div className="fixed top-0 left-64 right-0 h-18 bg-white shadow-sm border-b border-gray-200 flex items-center justify-end px-6 z-10">
      {/* Right side - User Profile & Notifications */}
      <div className="flex items-center space-x-4">
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          {/* TODO: modify to button and flyout */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            TU
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Test User</div>
            <div className="text-xs text-gray-500">test@company.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
