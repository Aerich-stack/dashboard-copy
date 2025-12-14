import React, { useState, useEffect } from "react";
import logo from "../images/logo.png"; 
interface SidebarProps {
  role: "teacher" | "admin";
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout: () => void;

  pendingAttendanceCount?: number;
  unverifiedSalaryCount?: number;
  unreadMessagesCount?: number;

  onToggle?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  onLogout,
  pendingAttendanceCount = 0,
  unverifiedSalaryCount = 0,
  unreadMessagesCount = 0,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // ✅ Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
        onToggle?.(false);
      } else {
        setIsOpen(true);
        onToggle?.(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  // ✅ Menu definitions
  const teacherMenuItems = [
    { label: "Home", tab: "home" },
    { label: "Attendance", tab: "attendance" },
    { label: "Teaching Load", tab: "teaching_load" },
    { label: "Salary", tab: "salary" },
    { label: "Messages", tab: "messages", badge: unreadMessagesCount },
    { label: "Settings", tab: "settings" },
  ];

  const adminMenuItems = [
    { label: "Dashboard", tab: "dashboard" },
    { label: "Verify Attendance", tab: "verify", badge: pendingAttendanceCount },
    { label: "Compute Salary", tab: "compute", badge: unverifiedSalaryCount },
    { label: "Manage Teachers", tab: "teachers" },
    { label: "Teaching Load", tab: "teaching_load" },
    { label: "Reports", tab: "reports" },
    { label: "Messages", tab: "messages", badge: unreadMessagesCount },
    { label: "Settings", tab: "settings" },
  ];

  const menuItems = role === "teacher" ? teacherMenuItems : adminMenuItems;

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen z-50
        bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 text-white
        shadow-xl transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* ✅ HEADER */}
      <div className="p-4 border-b border-white/20 flex flex-col items-center">
        {role === "admin" ? (
          <>
            {/* ✅ ADMIN LOGO (CENTERED) */}
            <img
              src={logo}
              alt="Admin Logo"
              className={`transition-all ${
                isOpen ? "w-20 h-20" : "w-10 h-10"
              } object-contain`}
            />
            {isOpen && (
              <p className="text-xs text-sky-200 mt-2">Management Panel</p>
            )}
          </>
        ) : (
          <>
            {/* ✅ TEACHER PROFILE PIC PLACEHOLDER */}
            <div
              className={`rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white
                ${isOpen ? "w-20 h-20 text-4xl" : "w-10 h-10 text-xl"}
              `}
            >
              {/* Placeholder initials or icon */}
              👤
            </div>
            {isOpen && (
              <p className="text-xs text-sky-200 mt-2">Teacher Dashboard</p>
            )}
          </>
        )}
      </div>

      {/* ✅ MENU */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onTabChange?.(item.tab)}
            className={`
              w-full flex items-center justify-between
              rounded-lg px-3 py-3 transition-all duration-200
              hover:bg-white/10
              ${activeTab === item.tab ? "bg-white/20" : ""}
            `}
            title={!isOpen ? item.label : ""}
          >
            <span className="text-sm font-medium truncate">
              {isOpen ? item.label : item.label.charAt(0)}
            </span>

            {item.badge && item.badge > 0 && (
              <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full ml-2">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ✅ FOOTER */}
      <div className="p-6 border-t border-white/20">
        <button
          onClick={onLogout}
          className="w-full py-4 bg-amber-400 hover:bg-amber-500 rounded-lg text-center font-semibold text-sm transition shadow-md"
        >
          {isOpen ? "Logout" : "🚪"}
        </button>
      </div>

      {/* ✅ MOBILE TOGGLE */}
      <button
        onClick={toggleSidebar}
        className="absolute right-2 top-2 bg-sky-700 hover:bg-sky-600 text-white p-2 rounded-full shadow-xl md:hidden"
      >
        {isOpen ? "✖" : "☰"}
      </button>
    </div>
  );
};

export default Sidebar;
