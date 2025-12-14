import React, { useState, useEffect } from "react";
import TeacherSettings from "./TeacherSettings";
import api from "../services/api";
import TeacherTeachingLoad from "../teacher/TeacherTeachingLoad";
import AttendanceSubmission from "./AttendanceSubmission";
import SalaryView from "./SalaryView";
import MessagesComponent from "./MessageComponent";

interface TeacherData {
  id: number;
  name: string;
  email: string;
  department: string;
  basic_pay: number;
}

interface TeacherHomeProps {
  teacher: TeacherData;
  activeTab?: string;
  onLogout: () => void;
}

const TeacherHome: React.FC<TeacherHomeProps> = ({
  teacher: initialTeacher,
  activeTab = "home",
  onLogout,
}) => {
  const [teacher, setTeacher] = useState<TeacherData>(initialTeacher);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTeacher(initialTeacher);
  }, [initialTeacher]);

  const fetchTeacherData = async (teacherId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/teachers/${teacherId}`);
      if (response.data.success) {
        setTeacher(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherId");
    onLogout();
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${require("../images/bg.png")})`,
        backgroundSize: "110%",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/35"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animation: "float 8s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animation: "float 8s ease-in-out infinite 2s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-20 mx-4 md:mx-6 mt-6 md:mt-8 mb-4">
        <div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 md:px-6 py-3 md:py-4 shadow-lg flex items-center justify-center"
          style={{ animation: "slideInDown 0.6s ease-out" }}
        >
          <h1
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent"
            style={{ animation: "slideInRight 0.6s ease-out 0.2s backwards" }}
          >
            Payroll System
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 md:px-6 py-4 min-h-screen">
        {loading && (
          <p className="text-center text-white text-lg font-semibold animate-pulse">
            Loading...
          </p>
        )}

        {/* ✅ HOME TAB */}
        {activeTab === "home" && (
          <div
            className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            style={{ animation: "slideIn 0.6s ease-out" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-white drop-shadow-lg">
              Welcome, {teacher?.name || "Teacher"}! 👋
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 transform">
                <p className="text-sm text-white/80 mb-1">Email</p>
                <p className="text-base font-semibold text-white break-words">
                  {teacher?.email}
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 transform">
                <p className="text-sm text-white/80 mb-1">Department</p>
                <p className="text-base font-semibold text-white">
                  {teacher?.department}
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 transform">
                <p className="text-sm text-white/80 mb-1">Basic Pay</p>
                <p className="text-base font-semibold text-white">
                  ₱{teacher?.basic_pay.toLocaleString()}
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 transform">
                <p className="text-sm text-white/80 mb-1">Teacher ID</p>
                <p className="text-base font-semibold text-white">
                  {teacher?.id}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ PROFILE */}
        {activeTab === "profile" && <TeacherSettings teacherId={teacher?.id} />}

        {/* ✅ ATTENDANCE */}
        {activeTab === "attendance" && (
          <AttendanceSubmission teacherId={teacher?.id} />
        )}

        {/* ✅ TEACHING LOAD — NEW COMPONENT */}
        {activeTab === "teaching_load" && (
          <TeacherTeachingLoad teacherId={teacher?.id} />
        )}

        {/* ✅ SALARY */}
        {activeTab === "salary" && <SalaryView teacherId={teacher?.id} />}

        {/* ✅ MESSAGES */}
        {activeTab === "messages" && (
          <MessagesComponent
            teacherId={teacher?.id}
            teacherName={teacher?.name}
          />
        )}

        {/* ✅ SETTINGS */}
        {activeTab === "settings" && (
          <TeacherSettings teacherId={teacher?.id} />
        )}
      </div>
    </div>
  );
};

export default TeacherHome;
