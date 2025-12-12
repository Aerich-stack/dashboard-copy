import React, { useState, useEffect } from 'react';
import './App.css';
import TeacherLogin from './teacher/TeacherLogin';
import TeacherHome from './teacher/TeacherHome';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import Sidebar from './components/Sidebar';
import ResetPassword from './components/ResetPassword';
function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Check if user is accessing reset-password page via URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('reset-password') || window.location.pathname.includes('reset-password')) {
      setPage('reset-password');
    }
  }, []);

  const handleTeacherLogin = (teacher: any) => {
    setUser(teacher);
    setPage('teacher-dashboard');
    setActiveTab('home');
  };

  const handleAdminLogin = () => {
    setPage('admin-dashboard');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('home');
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen">
      {page === 'home' && (
        <div 
          className="min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden"
          style={{
            backgroundImage: `url(${require('./images/bg.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Navigation Bar */}
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

            {/* Hero Section */}
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
                {/* Teacher Login Card */}
                <button 
                  onClick={() => setPage('teacher-login')}
                  className="group relative bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl slide-in-left cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👨‍🏫</div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      Teacher Login
                    </h3>
                    <p className="text-blue-100 group-hover:text-blue-200 transition-colors mb-4">
                      Access your personal dashboard to submit attendance records, track teaching hours, view salary computations, and manage payslips
                    </p>
                    <div className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold group-hover:bg-blue-400 transition-colors">
                      Login Now →
                    </div>
                  </div>
                </button>

                {/* Admin Login Card */}
                <button 
                  onClick={() => setPage('admin-login')}
                  className="group relative bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl slide-in-right cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👩‍💼</div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      Admin Login
                    </h3>
                    <p className="text-blue-100 group-hover:text-purple-200 transition-colors mb-4">
                      Access the administrative panel to manage teachers, verify attendance submissions, compute salaries, generate reports, and export payslips
                    </p>
                    <div className="inline-block px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold group-hover:bg-purple-400 transition-colors">
                      Login Now →
                    </div>
                  </div>
                </button>
              </div>

              {/* Features Section */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 slide-in-up">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-3xl mb-3">✓</div>
                  <h4 className="text-lg font-bold text-white mb-2">Easy Attendance</h4>
                  <p className="text-blue-100 text-sm">Submit and track attendance with a user-friendly interface</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-3xl mb-3">💰</div>
                  <h4 className="text-lg font-bold text-white mb-2">Smart Payroll</h4>
                  <p className="text-blue-100 text-sm">Automatic salary computation based on verified hours</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-3xl mb-3">📄</div>
                  <h4 className="text-lg font-bold text-white mb-2">Digital Payslips</h4>
                  <p className="text-blue-100 text-sm">Generate, view, print, and export payslips instantly</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      {page === 'teacher-login' && (
        <TeacherLogin onLogin={handleTeacherLogin} onBack={() => setPage('home')} />
      )}

      {page === 'teacher-dashboard' && user && (
        <div className="flex h-screen">
          <Sidebar role="teacher" activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
          <div className="flex-1 overflow-auto">
            <TeacherHome teacher={user} activeTab={activeTab} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {page === 'admin-login' && (
        <AdminLogin onLogin={handleAdminLogin} onBack={() => setPage('home')} />
      )}

      {page === 'admin-dashboard' && (
        <div className="flex h-screen">
          <Sidebar role="admin" activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
          <div className="flex-1 overflow-auto">
            <AdminDashboard activeTab={activeTab} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {page === 'reset-password' && (
        <ResetPassword onBack={() => setPage('home')} />
      )}
    </div>
  );
}

export default App;
