import React, { useState } from 'react';

interface SidebarProps {
  role: 'teacher' | 'admin';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, onTabChange, onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);

  const teacherMenuItems = [
    { label: 'Home', tab: 'home' },
    { label: 'Attendance', tab: 'attendance' },
    { label: 'Teaching Load', tab: 'teaching_load' },
    { label: 'Salary', tab: 'salary' },
    { label: 'Messages', tab: 'messages' },
    { label: 'Settings', tab: 'settings' },
  ];

  const adminMenuItems = [
    { label: 'Dashboard', tab: 'dashboard' },
    { label: 'Verify Attendance', tab: 'verify' },
    { label: 'Compute Salary', tab: 'compute' },
    { label: 'Manage Teachers', tab: 'teachers' },
    { label: 'Teaching Load', tab: 'teaching_load' },
    { label: 'Reports', tab: 'reports' },
    { label: 'Messages', tab: 'messages' },
    { label: 'Settings', tab: 'settings' },
  ];

  const menuItems = role === 'teacher' ? teacherMenuItems : adminMenuItems;

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} h-screen bg-gradient-to-b from-sky-700 via-sky-800 to-sky-900 text-white transition-all duration-500 flex flex-col shadow-xl`}>
      
      {/* HEADER */}
      <div className="p-4 border-b border-white/20">
        {isOpen ? (
          <div>
            <h1 className="text-xl font-bold">{role === 'teacher' ? '👨‍🏫 Teacher' : '👩‍💼 Admin'}</h1>
            <p className="text-xs text-sky-200 mt-1">
              {role === 'teacher' ? 'Dashboard' : 'Management Panel'}
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="text-3xl">{role === 'teacher' ? '👨‍🏫' : '👩‍💼'}</span>
          </div>
        )}
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onTabChange && onTabChange(item.tab)}
            className={`w-full flex items-center rounded-lg px-3 py-3 transition-all duration-300 
              ${activeTab === item.tab
                ? 'bg-sky-600 shadow-md shadow-sky-500/40 scale-[1.02]'
                : 'hover:bg-sky-700/40'
              }`}
            title={!isOpen ? item.label : ''}
          >
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={onLogout}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-center font-semibold text-sm transition shadow-md"
        >
          {isOpen ? 'Logout' : '🚪'}
        </button>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-10 bg-sky-700 hover:bg-sky-600 text-white p-2 rounded-full shadow-xl"
      >
        {isOpen ? '◀' : '▶'}
      </button>
    </div>
  );
};

export default Sidebar;