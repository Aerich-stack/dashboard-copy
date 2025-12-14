// ===============================
//  ADMIN DASHBOARD (FULL GLASS)
//  Strict Professional Theme
//  TeacherHome Header Style
//  Floating Blobs + Glass Cards
//  Semi-Transparent Amber Buttons
//  All Logic Preserved
// ===============================

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  api,
  teacherAPI,
  attendanceAPI,
  salaryAPI
} from "../services/api";

import notificationAPI from "../services/notificationAPI";

/* =====================
   PROPS
===================== */

interface AdminDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/* =====================
   SHARED TYPES
===================== */

interface DashboardStats {
  totalSubmissions: number;
  pendingAttendance: number;
  verifiedHours: number;
}

interface SalaryBar {
  teacher: string;
  total: number;
}

interface AttendancePie {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface Teacher {
  id: number;
  name: string;
  email?: string;
  rate_per_hour?: number;
}

interface AttendanceRecord {
  id: number;
  teacher_id: number;
  teacher_name: string;
  date: string;
  hours: number;
  status: "pending" | "approved" | "rejected";
  subject?: string;
  remarks?: string;
}

interface SalaryRow {
  id?: number;
  teacher_id: number;
  teacher_name: string;
  period_start: string;
  period_end: string;
  total_hours: number;
  rate_per_hour: number;
  gross_salary: number;
  deductions: number;
  net_salary: number;
  finalized?: boolean;
}

interface SalaryHistoryRow {
  id: number;
  teacher_id: number;
  teacher_name: string;
  period_start: string;
  period_end: string;
  total_salary: number;
}

/* =============================
   MAIN WRAPPER + BACKGROUND
============================= */

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab,
  onTabChange,
}) => {
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
      {/* Dark overlay + blur */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/40"></div>

      {/* Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 md:p-6 space-y-6">
        {activeTab === "dashboard" && <DashboardHome onTabChange={onTabChange} />}
        {activeTab === "verify" && <VerifyAttendance />}
        {activeTab === "compute" && <ComputeSalary />}
        {activeTab === "teachers" && <ManageTeachers />}
        {activeTab === "teaching_load" && <ManageTeachingLoad />}
        {activeTab === "reports" && <Reports />}
        {activeTab === "messages" && <AdminMessages />}
        {activeTab === "settings" && <AdminSettings />}
      </div>
    </div>
  );
};

/* =============================
   DASHBOARD HOME (GLASS)
============================= */

interface DashboardHomeProps {
  onTabChange: (tab: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onTabChange }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubmissions: 0,
    pendingAttendance: 0,
    verifiedHours: 0,
  });

  const [salaryBars, setSalaryBars] = useState<SalaryBar[]>([]);
  const [attendancePie, setAttendancePie] = useState<AttendancePie[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, salaryRes, attendanceRes] = await Promise.all([
        api.get("/api/dashboard/stats"),
        api.get("/api/salary/summary"),
        api.get("/api/attendance/summary"),
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (salaryRes.data?.success) setSalaryBars(salaryRes.data.data || []);

      if (attendanceRes.data?.success) {
        const raw = attendanceRes.data.data || [];
        const normalized: AttendancePie[] = raw.map((item: any) => ({
          name: item.name,
          value: Number(item.value) || 0,
        }));
        setAttendancePie(normalized);
      }
    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
  };

  const pieColors = useMemo(() => ["#22c55e", "#ef4444"], []);

  /* =============================
     Dashboard Card (Glass)
  ============================== */

  const DashboardCard: React.FC<{
    title: string;
    value: number;
    highlight?: boolean;
    onClick?: () => void;
  }> = ({ title, value, highlight, onClick }) => (
    <div
      onClick={onClick}
      className={`glass-card cursor-pointer transition transform hover:scale-105 p-5 border ${
        highlight ? "border-amber-300/60" : "border-white/20"
      } bg-white/10 backdrop-blur-md rounded-xl shadow-lg`}
    >
      <h4 className="text-sm font-semibold text-white/80">{title}</h4>
      <p className="text-3xl font-bold mt-2 text-white">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="glass-card p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
          Admin Dashboard
        </h2>
        <p className="text-white/70 mt-1">
          Overview of submissions, attendance verification, and salary computation.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Teacher Submissions"
          value={stats.totalSubmissions}
          onClick={() => onTabChange("reports")}
        />
        <DashboardCard
          title="Pending Attendance"
          value={stats.pendingAttendance}
          highlight
          onClick={() => onTabChange("verify")}
        />
        <DashboardCard
          title="Verified Hours"
          value={stats.verifiedHours}
          onClick={() => onTabChange("compute")}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Salary Bar Chart */}
        <div className="glass-card p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
          <h3 className="font-bold text-white mb-4">Overall Salary per Teacher</h3>

          {salaryBars.length === 0 ? (
            <p className="text-white/70 text-sm">No salary data available yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryBars}>
                <XAxis dataKey="teacher" stroke="#e5e7eb" />
                <YAxis stroke="#e5e7eb" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,42,0.9)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e5e7eb",
                  }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Attendance Pie Chart */}
        <div className="glass-card p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
          <h3 className="font-bold text-white mb-4">Attendance Overview</h3>

          {attendancePie.length === 0 ? (
            <p className="text-white/70 text-sm">No attendance summary data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendancePie}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={110}
                >
                  {attendancePie.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,42,0.9)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e5e7eb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Notification */}
      <div className="glass-card p-4 border border-amber-300/40 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
        <p className="font-semibold text-amber-200 text-sm">
          📌 Attendance to verify
        </p>
        <p className="text-white/70 text-xs mt-1">
          There are pending attendance records requiring review.
        </p>
      </div>
    </div>
  );
};

/* =============================
   VERIFY ATTENDANCE (GLASS)
============================= */

const VerifyAttendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await attendanceAPI.getAllAttendance();
      const all: AttendanceRecord[] = res.data?.data || [];
      const pending = all.filter((r) => r.status === "pending");
      setRecords(pending);
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setActionLoadingId(id);
      await attendanceAPI.approveAttendance(id);
      await fetchPending();
    } catch (err) {
      console.error(err);
      setError("Failed to approve attendance.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActionLoadingId(id);
      await attendanceAPI.updateAttendance(id, { status: "rejected" });
      await fetchPending();
    } catch (err) {
      console.error(err);
      setError("Failed to reject attendance.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="glass-card p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl text-white">Verify Attendance</h2>

        <button
          onClick={fetchPending}
          className="px-3 py-1 text-sm rounded border border-amber-300/40 bg-amber-300/20 text-amber-200 hover:bg-amber-300/30"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-white/70">Loading...</p>}
      {error && (
        <p className="text-sm text-red-300 bg-red-500/20 border border-red-300/40 px-3 py-2 rounded">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-white/20 bg-white/5 rounded-lg">
          <thead className="bg-white/10 text-white">
            <tr>
              <th className="border border-white/20 p-2">Teacher</th>
              <th className="border border-white/20 p-2">Date</th>
              <th className="border border-white/20 p-2">Hours</th>
              <th className="border border-white/20 p-2">Subject</th>
              <th className="border border-white/20 p-2">Remarks</th>
              <th className="border border-white/20 p-2">Actions</th>
            </tr>
          </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-4 text-white/70 border border-white/20"
                  >
                    No pending attendance.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-white/10 transition text-white/90"
                  >
                    <td className="border border-white/20 p-2">{r.teacher_name}</td>
                    <td className="border border-white/20 p-2">{r.date}</td>
                    <td className="border border-white/20 p-2 text-center">{r.hours}</td>
                    <td className="border border-white/20 p-2">{r.subject || "—"}</td>
                    <td className="border border-white/20 p-2">{r.remarks || "—"}</td>
                    <td className="border border-white/20 p-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(r.id)}
                          disabled={actionLoadingId === r.id}
                          className="px-3 py-1 text-xs rounded border border-amber-300/40 bg-amber-300/20 text-amber-200 hover:bg-amber-300/30 disabled:opacity-50"
                        >
                          {actionLoadingId === r.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          disabled={actionLoadingId === r.id}
                          className="px-3 py-1 text-xs rounded border border-red-300/40 bg-red-300/20 text-red-200 hover:bg-red-300/30 disabled:opacity-50"
                        >
                          {actionLoadingId === r.id ? "..." : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
};

/* =============================
   COMPUTE SALARY (GLASS)
============================= */

const ComputeSalary: React.FC = () => {
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [results, setResults] = useState<SalaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compute = async () => {
    setError(null);
    setResults([]);

    if (!periodStart || !periodEnd) {
      setError("Please select a valid period.");
      return;
    }

    try {
      setLoading(true);
      const res = await salaryAPI.computeSalary(`${periodStart},${periodEnd}`);
      if (res.data?.success) {
        setResults(res.data.data || []);
      } else {
        setError("Failed to compute salary.");
      }
    } catch (err) {
      console.error(err);
      setError("Error computing salary.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (row: SalaryRow) => {
    try {
      setActionLoadingId(row.id || null);
      await salaryAPI.finalizeSalary(row.id!);
      const updated = results.map((r) =>
        r.id === row.id ? { ...r, finalized: true } : r
      );
      setResults(updated);
    } catch (err) {
      console.error(err);
      setError("Failed to finalize salary.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalPayroll = useMemo(
    () => results.reduce((sum, r) => sum + r.net_salary, 0),
    [results]
  );

  return (
    <div className="glass-card p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg space-y-6">
      <h2 className="font-bold text-xl text-white">Compute Salary</h2>

      {/* Period Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-white/70">Period Start</label>
          <input
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            className="border border-white/30 bg-white/20 text-black rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="text-xs text-white/70">Period End</label>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            className="border border-white/30 bg-white/20 text-black rounded px-2 py-1 w-full"
          />
        </div>

        <button
          onClick={compute}
          className="px-4 py-2 mt-6 bg-amber-300/20 border border-amber-300/40 text-amber-200 rounded hover:bg-amber-300/30"
        >
          Compute
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-300 bg-red-500/20 border border-red-300/40 px-3 py-2 rounded">
          {error}
        </p>
      )}

      {/* Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 border border-white/20 bg-white/10 rounded">
            <p className="text-xs text-white/70 uppercase">Teachers computed</p>
            <p className="text-2xl font-bold text-white">{results.length}</p>
          </div>

          <div className="glass-card p-4 border border-white/20 bg-white/10 rounded">
            <p className="text-xs text-white/70 uppercase">Total payroll (net)</p>
            <p className="text-2xl font-bold text-white">
              ₱{totalPayroll.toLocaleString()}
            </p>
          </div>

          <div className="glass-card p-4 border border-white/20 bg-white/10 rounded">
            <p className="text-xs text-white/70 uppercase">Period</p>
            <p className="text-sm font-semibold text-white">
              {periodStart || "?"} → {periodEnd || "?"}
            </p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-white/20 bg-white/5 rounded-lg">
          <thead className="bg-white/10 text-white">
            <tr>
              <th className="border border-white/20 p-2">Teacher</th>
              <th className="border border-white/20 p-2">Total Hours</th>
              <th className="border border-white/20 p-2">Rate/hr</th>
              <th className="border border-white/20 p-2">Gross</th>
              <th className="border border-white/20 p-2">Deductions</th>
              <th className="border border-white/20 p-2">Net</th>
              <th className="border border-white/20 p-2">Status</th>
              <th className="border border-white/20 p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {results.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="border border-white/20 p-3 text-center text-white/70"
                >
                  No computed salary yet. Choose a period and click{" "}
                  <span className="font-semibold">Compute</span>.
                </td>
              </tr>
            ) : (
              results.map((r, idx) => (
                <tr key={idx} className="hover:bg-white/10 text-white/90">
                  <td className="border border-white/20 p-2">{r.teacher_name}</td>
                  <td className="border border-white/20 p-2 text-center">
                    {r.total_hours}
                  </td>
                  <td className="border border-white/20 p-2 text-right">
                    ₱{r.rate_per_hour.toLocaleString()}
                  </td>
                  <td className="border border-white/20 p-2 text-right">
                    ₱{r.gross_salary.toLocaleString()}
                  </td>
                  <td className="border border-white/20 p-2 text-right">
                    ₱{r.deductions.toLocaleString()}
                  </td>
                  <td className="border border-white/20 p-2 text-right font-semibold">
                    ₱{r.net_salary.toLocaleString()}
                  </td>
                  <td className="border border-white/20 p-2 text-center">
                    {r.finalized ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-300/20 text-green-200 border border-green-300/40">
                        Finalized
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-300/20 text-yellow-200 border border-yellow-300/40">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="border border-white/20 p-2 text-center">
                    <button
                      onClick={() => handleFinalize(r)}
                      disabled={r.finalized || actionLoadingId === r.id}
                      className="px-3 py-1 bg-amber-300/20 border border-amber-300/40 text-amber-200 rounded text-xs hover:bg-amber-300/30 disabled:opacity-50"
                    >
                      {r.finalized
                        ? "Finalized"
                        : actionLoadingId === r.id
                        ? "Saving..."
                        : "Finalize"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =============================
   MANAGE TEACHERS (GLASS)
============================= */

const ManageTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rate, setRate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const res = await teacherAPI.getAllTeachers();
      if (res.data?.success) {
        setTeachers(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setRate("");
    setEditingTeacher(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name,
      email,
      rate_per_hour: rate ? Number(rate) : null,
    };

    try {
      if (editingTeacher) {
        await teacherAPI.updateTeacher(editingTeacher.id, payload);
      } else {
        await teacherAPI.createTeacher(payload);
      }
      await loadTeachers();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save teacher.");
    }
  };

  const handleEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setEmail(t.email || "");
    setRate(t.rate_per_hour !== undefined ? String(t.rate_per_hour) : "");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await teacherAPI.deleteTeacher(id);
      await loadTeachers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete teacher.");
    }
  };

  return (
    <div className="glass-card p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg space-y-6">
      <h2 className="font-bold text-xl text-white">Manage Teachers</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
      >
        <div>
          <label className="text-xs text-white/70">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-white/30 bg-white/20 text-black rounded px-2 py-1 w-full"
            required
          />
        </div>

        <div>
          <label className="text-xs text-white/70">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-white/30 bg-white/20 text-black rounded px-2 py-1 w-full"
          />
        </div>

        <div>
          <label className="text-xs text-white/70">Rate per hour (₱)</label>
          <input
            type="number"
            min="0"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="border border-white/30 bg-white/20 text-black rounded px-2 py-1 w-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-2 bg-amber-300/20 border border-amber-300/40 text-amber-200 rounded text-xs hover:bg-amber-300/30"
          >
            {editingTeacher ? "Update" : "Add"}
          </button>

          {editingTeacher && (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-2 text-xs bg-white/10 border border-white/20 text-white rounded hover:bg-white/20"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-white/70 text-sm">Loading...</p>
        ) : teachers.length === 0 ? (
          <p className="text-white/70 text-sm">No teachers found. Add one above.</p>
        ) : (
          <table className="w-full text-sm border border-white/20 bg-white/5 rounded-lg">
            <thead className="bg-white/10 text-white">
              <tr>
                <th className="border border-white/20 p-2">Name</th>
                <th className="border border-white/20 p-2">Email</th>
                <th className="border border-white/20 p-2">Rate/hr</th>
                <th className="border border-white/20 p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-white/10 text-white/90">
                  <td className="border border-white/20 p-2">{t.name}</td>
                  <td className="border border-white/20 p-2">
                    {t.email || <span className="text-white/50">—</span>}
                  </td>
                  <td className="border border-white/20 p-2 text-right">
                    {t.rate_per_hour
                      ? `₱${t.rate_per_hour.toLocaleString()}`
                      : "Unset"}
                  </td>
                  <td className="border border-white/20 p-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(t)}
                        className="px-2 py-1 text-xs rounded bg-amber-300/20 border border-amber-300/40 text-amber-200 hover:bg-amber-300/30"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-2 py-1 text-xs rounded bg-red-300/20 border border-red-300/40 text-red-200 hover:bg-red-300/30"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* =============================
   TEACHING LOAD (GLASS)
============================= */

const ManageTeachingLoad: React.FC = () => {
  return (
    <div className="glass-card p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
      <h2 className="font-bold text-xl text-white mb-2">Teaching Load</h2>
      <p className="text-white/70 text-sm mb-3">
        Assign subjects and hours per teacher here. (API ready at
        /api/teaching-load, hook it up when the schema is final.)
      </p>
      <p className="text-white/50 text-xs">
        You can use teachingLoadAPI.createTeachingLoad, getAllTeachingLoads,
        updateTeachingLoad, etc. to build a full CRUD here.
      </p>
    </div>
  );
};

/* =============================
   REPORTS (GLASS)
============================= */

const Reports: React.FC = () => {
  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");
  const [rows, setRows] = useState<SalaryHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    setRows([]);

    try {
      setLoading(true);
      if (periodStart && periodEnd) {
        const res = await salaryAPI.getSalarySummaryByPeriod(
          periodStart,
          periodEnd
        );
        if (res.data?.success) {
          setRows(res.data.data || []);
        } else {
          setError("Failed to fetch salary summary.");
        }
      } else {
        const res = await salaryAPI.getAllSalary();
        if (res.data?.success) {
          setRows(res.data.data || []);
        } else {
          setError("Failed to fetch salary history.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error loading reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="glass-card p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg space-y-6">
      <h2 className="font-bold text-xl text-white">Salary Reports</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-end">
        <div>
          <label className="text-xs text-white/70">Period Start (optional)</label>
          <input
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            className="border border-white/30 bg-white/20 text-black rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-white/70">Period End (optional)</label>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            className="border border-white/30 bg-white/20 text-black rounded px-2 py-1 text-sm"
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-amber-300/20 border border-amber-300/40 text-amber-200 rounded text-sm hover:bg-amber-300/30"
        >
          Filter
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-300 bg-red-500/20 border border-red-300/40 px-3 py-2 rounded">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-white/70 text-sm">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-white/70 text-sm">
            No salary records found for the selected period.
          </p>
        ) : (
          <table className="w-full text-sm border border-white/20 bg-white/5 rounded-lg">
            <thead className="bg-white/10 text-white">
              <tr>
                <th className="border border-white/20 p-2">Teacher</th>
                <th className="border border-white/20 p-2">Period</th>
                <th className="border border-white/20 p-2">Total Salary</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="hover:bg-white/10 text-white/90">
                  <td className="border border-white/20 p-2">{s.teacher_name}</td>
                  <td className="border border-white/20 p-2">
                    {s.period_start} → {s.period_end}
                  </td>
                  <td className="border border-white/20 p-2 text-right">
                    ₱{s.total_salary.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* =============================
   ADMIN SETTINGS (GLASS)
============================= */

const AdminSettings: React.FC = () => (
  <div className="glass-card p-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg max-w-md">
    <h2 className="font-bold text-xl text-white mb-4">Admin Settings</h2>
    <p className="text-white/70 text-sm mb-2">
      This is a placeholder for updating admin password, email notifications,
      and other preferences.
    </p>
    <p className="text-white/50 text-xs">
      You can connect this to your auth endpoints once they are fully defined.
    </p>
  </div>
);

/* =============================
   ADMIN MESSAGES (GLASS)
============================= */

const AdminMessages: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(
    null
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    loadNotifications();
    loadConversations();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await notificationAPI.getAllNotifications();
      if (res.data?.success) setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await api.get("/api/messages/conversations");
      if (res.data?.success) setConversations(res.data.data || []);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const res = await api.get(`/api/messages/${conversationId}`);
      if (res.data?.success) setMessages(res.data.data || []);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const openConversation = (conv: any) => {
    setSelectedConversation(conv);
    loadMessages(conv.id);
  };

  const sendMessage = async () => {
    if (!selectedConversation || !messageText.trim()) return;

    try {
      await api.post("/api/messages/send", {
        conversation_id: selectedConversation.id,
        message: messageText,
      });

      setMessageText("");
      loadMessages(selectedConversation.id);
      loadConversations();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">

      {/* LEFT PANEL */}
      <div className="glass-card p-4 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg space-y-4 overflow-auto">
        <h2 className="font-bold text-lg text-white">Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-white/70 text-sm">No notifications.</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="p-2 bg-white/10 border border-white/20 rounded text-sm text-white/90"
              >
                {n.message}
              </li>
            ))}
          </ul>
        )}

        <hr className="border-white/20" />

        <h2 className="font-bold text-lg text-white">Messages</h2>

        {conversations.length === 0 ? (
          <p className="text-white/70 text-sm">No conversations yet.</p>
        ) : (
          <ul className="space-y-2">
            {conversations.map((c) => (
              <li
                key={c.id}
                onClick={() => openConversation(c)}
                className={`p-2 rounded cursor-pointer border ${
                  selectedConversation?.id === c.id
                    ? "bg-amber-300/20 border-amber-300/40 text-amber-200"
                    : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                }`}
              >
                <p className="font-semibold">{c.teacher_name}</p>
                <p className="text-xs text-white/60 truncate">
                  {c.last_message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="md:col-span-2 glass-card p-4 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg flex flex-col">
        {!selectedConversation ? (
          <p className="text-white/70 text-sm">
            Select a conversation to view messages.
          </p>
        ) : (
          <>
            <h2 className="font-bold text-lg text-white mb-4">
              Conversation with {selectedConversation.teacher_name}
            </h2>

            <div className="flex-1 overflow-auto border border-white/20 p-3 rounded bg-white/5 space-y-3">
              {messages.map((m: any) => (
                <div
                  key={m.id}
                  className={`p-2 rounded max-w-xs ${
                    m.sender === "admin"
                      ? "bg-amber-300/20 border border-amber-300/40 text-amber-200 self-end"
                      : "bg-white/10 border border-white/20 text-white/90 self-start"
                  }`}
                >
                  {m.message}
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 border border-white/30 bg-white/20 text-black rounded px-3 py-2"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-amber-300/20 border border-amber-300/40 text-amber-200 rounded hover:bg-amber-300/30"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* =============================
   EXPORT DEFAULT
============================= */

export default AdminDashboard;
