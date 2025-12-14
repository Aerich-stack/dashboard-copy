import React, { useState, useEffect, useMemo } from "react";
import TeacherSettings from "./TeacherSettings";
import api from "../services/api";
import TeacherTeachingLoad from "../teacher/TeacherTeachingLoad";
import AttendanceSubmission from "./AttendanceSubmission";
import SalaryView from "./SalaryView";
import MessagesComponent from "./MessageComponent";

interface TeacherData {
  id: number;
  name: string;
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

  const [classesToday, setClassesToday] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [salaryStatus, setSalaryStatus] = useState("N/A");

  const [teachingLoad, setTeachingLoad] = useState<any[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);

  useEffect(() => {
    setTeacher(initialTeacher);
    fetchDashboardData();
  }, [initialTeacher]);

  const fetchDashboardData = async () => {
    const teacherId = initialTeacher.id;
    setLoading(true);

    try {
      const [loadRes, attendanceRes, salaryRes] = await Promise.all([
        api.get(`/api/teaching-load/teacher/${teacherId}`),
        api.get(`/api/attendance/teacher/${teacherId}`),
        api.get(`/api/salary/teacher/${teacherId}`),
      ]);

      const loadData = loadRes.data?.data || [];
      const attendanceData = attendanceRes.data?.data || [];
      const salaryData = salaryRes.data?.data || [];

      setTeachingLoad(loadData);
      setRecentAttendance(attendanceData.slice(0, 5));

      setTotalSubjects(loadData.length);
      setClassesToday(loadData.length);
      setAttendanceCount(attendanceData.length);

      if (salaryData.length > 0) {
        const latest = salaryData[salaryData.length - 1];
        setSalaryStatus(latest.status === "Released" ? "Released" : "Pending");
      } else {
        setSalaryStatus("N/A");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherId");
    onLogout();
  };

  // ✅ Mood Booster
  const moodMessage = useMemo(() => {
    const hours = new Date().getHours();
    let baseGreeting = "Welcome back";

    if (hours < 12) baseGreeting = "Good morning";
    else if (hours < 18) baseGreeting = "Good afternoon";
    else baseGreeting = "Good evening";

    let encouragement = "Hope you’re having a steady day.";

    if (classesToday > 0 && attendanceCount === 0) {
      encouragement = "You’ve got classes today — you’re all set to make an impact.";
    } else if (attendanceCount > 0) {
      encouragement = "Nice work keeping your attendance updated.";
    }

    if (salaryStatus === "Released") {
      encouragement = "Your latest salary is released — don’t forget to treat yourself a little.";
    }

    return `${baseGreeting}, ${teacher?.name || "Teacher"}. ${encouragement}`;
  }, [teacher?.name, classesToday, attendanceCount, salaryStatus]);

  // ✅ Mini Achievements
  const achievements = useMemo(() => {
    const list: { label: string; achieved: boolean; description?: string }[] = [];

    list.push({
      label: "Submitted attendance",
      achieved: attendanceCount > 0,
      description:
        attendanceCount > 0
          ? "You’ve started logging your classes."
          : "Once you submit attendance, it shows up here.",
    });

    list.push({
      label: "Active teaching load",
      achieved: totalSubjects > 0,
      description:
        totalSubjects > 0
          ? "You’re assigned to at least one subject."
          : "Teaching load will appear once assigned.",
    });

    list.push({
      label: "Recent salary released",
      achieved: salaryStatus === "Released",
      description:
        salaryStatus === "Released"
          ? "Latest salary period is cleared."
          : "Once HR releases your salary, this will be marked.",
    });

    return list;
  }, [attendanceCount, totalSubjects, salaryStatus]);

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
      {/* Background overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/35"></div>

      {/* Floating colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        ></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-20 mx-4 md:mx-6 mt-6 md:mt-8 mb-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 md:px-6 py-3 md:py-4 shadow-lg flex items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">
            Teacher Portal Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 md:px-6 py-4 min-h-screen">
        {loading && (
          <p className="text-center text-white text-lg font-semibold animate-pulse">
            Loading...
          </p>
        )}

        {/* ✅ HOME DASHBOARD */}
        {activeTab === "home" && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6 border border-white/20">

            {/* ✅ Mood Booster */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
                Welcome back, {teacher?.name || "Teacher"}! 👋
              </h2>
              <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto">
                {moodMessage}
              </p>
            </div>

            {/* ✅ Stats + Teaching Load */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

              {/* Stats */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-4">
                  <h3 className="text-white/80 text-sm">Classes Today</h3>
                  <p className="text-3xl font-bold text-white mt-1">{classesToday}</p>
                </div>

                <div className="glass-card p-4">
                  <h3 className="text-white/80 text-sm">Total Subjects</h3>
                  <p className="text-3xl font-bold text-white mt-1">{totalSubjects}</p>
                </div>

                <div className="glass-card p-4">
                  <h3 className="text-white/80 text-sm">Attendance Records</h3>
                  <p className="text-3xl font-bold text-white mt-1">{attendanceCount}</p>
                </div>

                <div className="glass-card p-4">
                  <h3 className="text-white/80 text-sm">Salary Status</h3>
                  <p className="text-3xl font-bold text-amber-400 mt-1">
                    {salaryStatus}
                  </p>
                </div>
              </div>

              {/* Teaching Load */}
              <div className="glass-card p-4">
                <h3 className="text-xl text-white mb-3">Teaching Load</h3>

                {teachingLoad.length === 0 ? (
                  <p className="text-white/70 text-sm">No teaching load assigned yet.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {teachingLoad.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white/10 rounded-lg border border-white/20"
                      >
                        <p className="text-white font-semibold">{item.subject}</p>
                        <p className="text-white/70 text-xs">{item.section}</p>
                        <p className="text-blue-300 text-[11px] mt-1">{item.schedule}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ✅ Recent Attendance + Mini Achievements (SIDE BY SIDE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              {/* ✅ Recent Attendance */}
              <div className="glass-card p-4">
                <h3 className="text-xl text-white mb-3">Recent Attendance</h3>

                {recentAttendance.length === 0 ? (
                  <p className="text-white/70 text-sm">No attendance submitted yet.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {recentAttendance.map((att, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white/10 rounded-lg border border-white/20 flex justify-between items-center"
                      >
                        <span className="text-white text-sm">{att.date}</span>

                        <span
                          className={`px-3 py-1 rounded-full text-[11px] ${
                            att.status === "Verified"
                              ? "bg-green-500/30 text-green-200"
                              : "bg-red-500/30 text-red-200"
                          }`}
                        >
                          {att.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ✅ Mini Achievements */}
              <div className="glass-card p-6 border-2 border-white/30 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
                  Mini Achievements ⭐
                </h3>

                <div className="space-y-4">
                  {achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <span
                        className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${
                          ach.achieved
                            ? "bg-green-500/40 border border-green-300 text-green-100"
                            : "bg-white/10 border border-white/40 text-white/70"
                        }`}
                      >
                        {ach.achieved ? "★" : "•"}
                      </span>

                      <div>
                        <p
                          className={`text-lg font-semibold ${
                            ach.achieved ? "text-green-100" : "text-white/80"
                          }`}
                        >
                          {ach.label}
                        </p>
                        {ach.description && (
                          <p className="text-sm text-white/60 mt-1">{ach.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ✅ OTHER TABS */}
        {activeTab === "profile" && <TeacherSettings teacherId={teacher?.id} />}
        {activeTab === "attendance" && (
          <AttendanceSubmission teacherId={teacher?.id} />
        )}
        {activeTab === "teaching_load" && (
          <TeacherTeachingLoad teacherId={teacher?.id} />
        )}
        {activeTab === "salary" && <SalaryView teacherId={teacher?.id} />}
        {activeTab === "messages" && (
          <MessagesComponent
            teacherId={teacher?.id}
            teacherName={teacher?.name}
          />
        )}
        {activeTab === "settings" && (
          <TeacherSettings teacherId={teacher?.id} />
        )}
      </div>
    </div>
  );
};

export default TeacherHome;
