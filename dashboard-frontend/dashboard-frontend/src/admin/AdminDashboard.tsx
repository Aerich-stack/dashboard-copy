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

/* =====================
   MAIN DASHBOARD WRAPPER
===================== */

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {activeTab === "dashboard" && <DashboardHome onTabChange={onTabChange} />}

      {activeTab === "verify" && <VerifyAttendance />}

      {activeTab === "compute" && <ComputeSalary />}

      {activeTab === "teachers" && <ManageTeachers />}

      {activeTab === "teaching_load" && <ManageTeachingLoad />}

      {activeTab === "reports" && <Reports />}

      {activeTab === "messages" && <AdminMessages />}

      {activeTab === "settings" && <AdminSettings />}
    </div>
  );
};

/* =====================
   DASHBOARD HOME
===================== */

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
const DashboardCard: React.FC<{
  title: string;
  value: number;
  highlight?: boolean;
  onClick?: () => void;
}> = ({ title, value, highlight, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-lg shadow cursor-pointer transition transform hover:scale-105 ${
      highlight ? "bg-yellow-100" : "bg-white"
    }`}
  >
    <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

  return (
    <div className="space-y-8">
      {/* CARDS */}
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

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Overall Salary per Teacher</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryBars}>
              <XAxis dataKey="teacher" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendancePie as { name: string; value: number }[]}
                dataKey="value"
                nameKey="name"
                label
              >
                {attendancePie.map((_, i) => (
                  <Cell
                    key={i}
                    fill={pieColors[i % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
        <p className="font-semibold text-yellow-800">
          📌 Attendance to verify
        </p>
        <p className="text-sm text-yellow-700">
          There are pending attendance records requiring review.
        </p>
      </div>
    </div>
  );
};

/* =====================
   DASHBOARD CARD
===================== */

const DashboardCard: React.FC<{
  title: string;
  value: number;
  highlight?: boolean;
}> = ({ title, value, highlight }) => (
  <div
    className={`p-6 rounded-lg shadow cursor-pointer transition transform hover:scale-105 ${
      highlight ? "bg-yellow-100" : "bg-white"
    }`}
  >
    <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

/* =====================
   VERIFY ATTENDANCE
===================== */

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
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">Verify Attendance</h2>
        <button
          onClick={fetchPending}
          className="px-3 py-1 text-sm rounded bg-sky-600 text-white hover:bg-sky-700"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {records.length === 0 && !loading ? (
        <p className="text-gray-500 text-sm">
          No pending attendance records.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Teacher</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Hours</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Remarks</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="border p-2">{r.teacher_name}</td>
                  <td className="border p-2">{r.date}</td>
                  <td className="border p-2">{r.hours}</td>
                  <td className="border p-2">{r.subject || "-"}</td>
                  <td className="border p-2">{r.remarks || "-"}</td>
                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(r.id)}
                        disabled={actionLoadingId === r.id}
                        className="px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoadingId === r.id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(r.id)}
                        disabled={actionLoadingId === r.id}
                        className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoadingId === r.id ? "..." : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* =====================
   COMPUTE SALARY (HIGH PRIORITY)
===================== */

const ComputeSalary: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("all");
  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");
  const [results, setResults] = useState<SalaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load teachers for dropdown
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const res = await teacherAPI.getAllTeachers();
        if (res.data?.success) {
          setTeachers(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadTeachers();
  }, []);

  const handleCompute = async () => {
    if (!periodStart || !periodEnd) {
      setError("Period start and end are required.");
      return;
    }
    setError(null);
    setLoading(true);
    setResults([]);

    try {
      const payload: any = {
        period_start: periodStart,
        period_end: periodEnd,
      };
      if (selectedTeacherId !== "all") {
        payload.teacher_id = Number(selectedTeacherId);
      }

      const res = await salaryAPI.computeSalary(payload);
      if (res.data?.success) {
        const data: SalaryRow[] = res.data.data || [];
        setResults(data);
      } else {
        setError(res.data?.message || "Failed to compute salary.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to compute salary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (row: SalaryRow) => {
    if (!row.id) {
      alert("Cannot finalize. Missing salary ID from backend.");
      return;
    }

    try {
      setActionLoadingId(row.id);
      await salaryAPI.finalizeSalary(row.id);
      // Refresh row status locally
      setResults((prev) =>
        prev.map((r) =>
          r.id === row.id ? { ...r, finalized: true } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to finalize salary.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalPayroll = useMemo(
    () => results.reduce((sum, r) => sum + (r.net_salary || 0), 0),
    [results]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="font-bold text-xl">Compute Salary</h2>
          <p className="text-gray-600 text-sm">
            Select a period and optionally a specific teacher to compute salaries.
          </p>
        </div>

        {/* FILTER FORM */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600">
              Period Start
            </label>
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600">
              Period End
            </label>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600">
              Teacher
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">All Teachers</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {t.rate_per_hour
                    ? ` (₱${t.rate_per_hour}/hr)`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompute}
            disabled={loading}
            className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-semibold hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? "Computing..." : "Compute"}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}

      {/* SUMMARY */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-sky-50 border border-sky-100 rounded">
            <p className="text-xs text-gray-500 uppercase">
              Teachers computed
            </p>
            <p className="text-2xl font-bold text-sky-700">
              {results.length}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded">
            <p className="text-xs text-gray-500 uppercase">
              Total payroll (net)
            </p>
            <p className="text-2xl font-bold text-emerald-700">
              ₱{totalPayroll.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-100 rounded">
            <p className="text-xs text-gray-500 uppercase">
              Period
            </p>
            <p className="text-sm font-semibold text-gray-700">
              {periodStart || "?"} → {periodEnd || "?"}
            </p>
          </div>
        </div>
      )}

      {/* RESULTS TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Teacher</th>
              <th className="border p-2">Total Hours</th>
              <th className="border p-2">Rate/hr</th>
              <th className="border p-2">Gross</th>
              <th className="border p-2">Deductions</th>
              <th className="border p-2">Net</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="border p-3 text-center text-gray-500"
                >
                  No computed salary yet. Choose a period and click
                  &nbsp;
                  <span className="font-semibold">Compute</span>.
                </td>
              </tr>
            ) : (
              results.map((r, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{r.teacher_name}</td>
                  <td className="border p-2 text-center">
                    {r.total_hours}
                  </td>
                  <td className="border p-2 text-right">
                    ₱{r.rate_per_hour.toLocaleString()}
                  </td>
                  <td className="border p-2 text-right">
                    ₱{r.gross_salary.toLocaleString()}
                  </td>
                  <td className="border p-2 text-right">
                    ₱{r.deductions.toLocaleString()}
                  </td>
                  <td className="border p-2 text-right font-semibold">
                    ₱{r.net_salary.toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">
                    {r.finalized ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        Finalized
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleFinalize(r)}
                      disabled={r.finalized || actionLoadingId === r.id}
                      className="px-3 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700 disabled:opacity-50"
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

      {/* FUTURE: add "Export Payslips" button here */}
    </div>
  );
};

/* =====================
   MANAGE TEACHERS
===================== */

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
    setRate(
      t.rate_per_hour !== undefined ? String(t.rate_per_hour) : ""
    );
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
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="font-bold text-xl mb-2">Manage Teachers</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
      >
        <div>
          <label className="text-xs font-semibold text-gray-600">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-2 py-1 w-full text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-2 py-1 w-full text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600">
            Rate per hour (₱)
          </label>
          <input
            type="number"
            min="0"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="border rounded px-2 py-1 w-full text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-sky-600 text-white text-sm rounded hover:bg-sky-700"
          >
            {editingTeacher ? "Update" : "Add"}
          </button>
          {editingTeacher && (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-2 text-xs bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : teachers.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No teachers found. Add one above.
          </p>
        ) : (
          <table className="w-full text-sm border mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Rate/hr</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td className="border p-2">{t.name}</td>
                  <td className="border p-2">
                    {t.email || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="border p-2 text-right">
                    {t.rate_per_hour
                      ? `₱${t.rate_per_hour.toLocaleString()}`
                      : "Unset"}
                  </td>
                  <td className="border p-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(t)}
                        className="px-2 py-1 text-xs rounded bg-amber-500 text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
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

/* =====================
   TEACHING LOAD
===================== */

const ManageTeachingLoad: React.FC = () => {
  // For now, simple placeholder with a note where to plug teachingLoadAPI later
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="font-bold text-xl mb-2">Teaching Load</h2>
      <p className="text-gray-600 text-sm mb-3">
        Assign subjects and hours per teacher here. (API ready at
        /api/teaching-load, hook it up when the schema is final.)
      </p>
      <p className="text-xs text-gray-500">
        You can use teachingLoadAPI.createTeachingLoad, getAllTeachingLoads,
        updateTeachingLoad, etc. to build a full CRUD here.
      </p>
    </div>
  );
};

/* =====================
   REPORTS (SALARY HISTORY)
===================== */

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
        // Fallback: load all
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="font-bold text-xl mb-2">Salary Reports</h2>

      <div className="flex flex-col md:flex-row gap-3 md:items-end">
        <div>
          <label className="text-xs font-semibold text-gray-600">
            Period Start (optional)
          </label>
          <input
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600">
            Period End (optional)
          </label>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-sky-600 text-white rounded text-sm hover:bg-sky-700"
        >
          Filter
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No salary records found for the selected period.
          </p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Teacher</th>
                <th className="border p-2">Period</th>
                <th className="border p-2">Total Salary</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td className="border p-2">{s.teacher_name}</td>
                  <td className="border p-2">
                    {s.period_start} → {s.period_end}
                  </td>
                  <td className="border p-2 text-right">
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

/* =====================
   SETTINGS
===================== */

const AdminSettings: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow max-w-md">
    <h2 className="font-bold text-xl mb-4">Admin Settings</h2>
    <p className="text-gray-600 text-sm mb-2">
      This is a placeholder for updating admin password, email notifications,
      and other preferences.
    </p>
    <p className="text-xs text-gray-500">
      You can connect this to your auth endpoints once they are fully defined.
    </p>
  </div>
);

/* =====================
   MESSAGES
===================== */

const AdminMessages: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
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
      loadMessages(selectedConversation.id); // ✅ refresh messages
      loadConversations(); // ✅ refresh sidebar preview
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {/* LEFT PANEL — Notifications + Conversations */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4 overflow-auto">
        <h2 className="font-bold text-lg">Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications.</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id} className="p-2 bg-gray-100 rounded text-sm">
                {n.message}
              </li>
            ))}
          </ul>
        )}

        <hr className="my-4" />

        <h2 className="font-bold text-lg">Messages</h2>

        {conversations.length === 0 ? (
          <p className="text-gray-500 text-sm">No conversations yet.</p>
        ) : (
          <ul className="space-y-2">
            {conversations.map((c) => (
              <li
                key={c.id}
                onClick={() => openConversation(c)}
                className={`p-2 rounded cursor-pointer ${
                  selectedConversation?.id === c.id
                    ? "bg-sky-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <p className="font-semibold">{c.teacher_name}</p>
                <p className="text-xs text-gray-600 truncate">
                  {c.last_message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT PANEL — Conversation Viewer */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-4 flex flex-col">
        {!selectedConversation ? (
          <p className="text-gray-500 text-sm">
            Select a conversation to view messages.
          </p>
        ) : (
          <>
            <h2 className="font-bold text-lg mb-4">
              Conversation with {selectedConversation.teacher_name}
            </h2>

            <div className="flex-1 overflow-auto border p-3 rounded bg-gray-50 space-y-3">
              {messages.map((m: any) => (
                <div
                  key={m.id}
                  className={`p-2 rounded max-w-xs ${
                    m.sender === "admin"
                      ? "bg-sky-200 self-end"
                      : "bg-gray-200 self-start"
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
                className="flex-1 border rounded px-3 py-2"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
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



export default AdminDashboard;
