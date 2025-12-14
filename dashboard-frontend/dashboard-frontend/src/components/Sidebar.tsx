import React, { useState, useEffect } from "react";

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

  // ✅ Auto-collapse on mobile, always open on desktop
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

  // ✅ Toggle handler
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
        bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-amber-300
        shadow-xl transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* HEADER */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        {isOpen ? (
          <div>
            <h1 className="text-xl font-bold">
              {role === "teacher" ? "👨‍🏫 Teacher" : "👩‍💼 Admin"}
            </h1>
            <p className="text-xs text-sky-200 mt-1">
              {role === "teacher" ? "Dashboard" : "Management Panel"}
            </p>
          </div>
        ) : (
          <span className="text-3xl">
            {role === "teacher" ? "👨‍🏫" : "👩‍💼"}
          </span>
        )}
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onTabChange?.(item.tab)}
            className={`
              w-full flex items-center justify-between
              rounded-lg px-3 py-3 transition-all duration-200
              hover:bg-white/10
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

      {/* FOOTER */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={onLogout}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-center font-semibold text-sm transition shadow-md"
        >
          {isOpen ? "Logout" : "🚪"}
        </button>
      </div>

      {/* ✅ MOBILE TOGGLE ONLY */}
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
