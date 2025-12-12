import React from 'react';

interface HeaderProps {
  title?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title = "Dashboard", onLogout }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-white to-sky-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-200">Teacher Payroll</p>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
