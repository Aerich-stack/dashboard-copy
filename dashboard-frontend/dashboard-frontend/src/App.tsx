import React, { useState, useEffect } from "react";
import "./App.css";

import TeacherLogin from "./teacher/TeacherLogin";
import TeacherHome from "./teacher/TeacherHome";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

import Sidebar from "./components/Sidebar";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("home");

  // ✅ Sidebar open/close state (controlled by Sidebar)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ Detect reset-password URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.has("reset-password") ||
      window.location.pathname.includes("reset-password")
    ) {
      setPage("reset-password");
    }
  }, []);

  const handleTeacherLogin = (teacher: any) => {
    setUser(teacher);
    setPage("teacher-dashboard");
    setActiveTab("home");
  };

  const handleAdminLogin = () => {
    setPage("admin-dashboard");
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
    setActiveTab("home");
  };

  return (
    <div className="min-h-screen">

      {/* ✅ HOME PAGE */}
      {page === "home" && (
        <div
          className="min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden"
          style={{
            backgroundImage: `url(${require("./images/bg.png")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div
              className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Navbar */}
            <nav className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 via-white to-sky-400 bg-clip-text text-transparent animate-pulse">
                      📚 Teacher Payroll System
                    </h1>
                  </div>
                </div>
              </div>
            </nav>

            {/* Hero */}
            <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
              <div className="text-center mb-12 slide-in-down">
                <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Welcome to Your Payroll Management Hub
                </h2>
                <p className="text-xl text-blue-100 drop-shadow-md">
                  Manage attendance, compute salaries, and generate payslips with ease
                </p>
              </div>

              {/* Login Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                {/* Teacher Login */}
                <button
                  onClick={() => setPage("teacher-login")}
                  className="group relative bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl slide-in-left cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      👨‍🏫
                    </div>
                    <h3 className="text-2-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      Teacher Login
                    </h3>
                    <p className="text-blue-100 group-hover:text-blue-200 transition-colors mb-4">
                      Access your dashboard to submit attendance, track hours, and view salary
                    </p>
                    <div className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold group-hover:bg-blue-400 transition-colors">
                      Login Now →
                    </div>
                  </div>
                </button>

                {/* Admin Login */}
                <button
                  onClick={() => setPage("admin-login")}
                  className="group relative bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl slide-in-right cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      👩‍💼
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      Admin Login
                    </h3>
                    <p className="text-blue-100 group-hover:text-purple-200 transition-colors mb-4">
                      Manage teachers, verify attendance, compute salaries, and generate reports
                    </p>
                    <div className="inline-block px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold group-hover:bg-purple-400 transition-colors">
                      Login Now →
                    </div>
                  </div>
                </button>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* ✅ TEACHER LOGIN */}
      {page === "teacher-login" && (
        <TeacherLogin
          onLogin={handleTeacherLogin}
          onBack={() => setPage("home")}
        />
      )}

      {/* ✅ TEACHER DASHBOARD */}
      {page === "teacher-dashboard" && user && (
        <div className="flex h-screen">
          <Sidebar
            role="teacher"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
            onToggle={setSidebarOpen}
          />

          {/* ✅ Content shifts based on sidebar state */}
          <div
            className={`h-full overflow-auto transition-all duration-500
      ${sidebarOpen ? "ml-64" : "ml-20"}
      md:ml-64

            `}
          >
            <TeacherHome
              teacher={user}
              activeTab={activeTab}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* ✅ ADMIN LOGIN */}
      {page === "admin-login" && (
        <AdminLogin onLogin={handleAdminLogin} onBack={() => setPage("home")} />
      )}

      {/* ✅ ADMIN DASHBOARD */}
      {page === "admin-dashboard" && (
        <div className="flex h-screen">
          <Sidebar
            role="admin"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
            pendingAttendanceCount={0}
            unverifiedSalaryCount={0}
            unreadMessagesCount={0}
            onToggle={setSidebarOpen}
          />

          {/* ✅ Content shifts based on sidebar state */}
          <div
            className={`h-full overflow-auto transition-all duration-500
            ${sidebarOpen ? "ml-64" : "ml-20"}
            md:ml-64
            `}
          
          >
            <AdminDashboard
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      )}

      {/* ✅ RESET PASSWORD */}
      {page === "reset-password" && (
        <ResetPassword onBack={() => setPage("home")} />
      )}
    </div>
  );
}

export default App;
