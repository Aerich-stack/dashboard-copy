import React, { useState, useEffect } from "react";
import axios from "axios";

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

const TeacherHome: React.FC<TeacherHomeProps> = ({ teacher: initialTeacher, activeTab = "home", onLogout }) => {
  const [teacher, setTeacher] = useState<TeacherData>(initialTeacher);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTeacher(initialTeacher);
  }, [initialTeacher]);

  const fetchTeacherData = async (teacherId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/teachers/${teacherId}`);
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
    <div className="min-h-screen bg-gray-100">
      <div className="px-6 py-8">
        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {activeTab === "home" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {teacher?.name || "Teacher"}!</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold">{teacher?.email}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-lg font-semibold">{teacher?.department}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">Basic Pay</p>
                <p className="text-lg font-semibold">₱{teacher?.basic_pay.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">Teacher ID</p>
                <p className="text-lg font-semibold">{teacher?.id}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "attendance" && <AttendanceSubmission teacherId={teacher?.id} />}
        {activeTab === "teaching_load" && <TeachingLoadView teacherId={teacher?.id} />}
        {activeTab === "salary" && <SalaryView teacherId={teacher?.id} />}
      </div>
    </div>
  );
};

const AttendanceSubmission: React.FC<{ teacherId?: number }> = ({ teacherId }) => {
  const [formData, setFormData] = useState({
    date: "",
    subject: "",
    class_section: "",
    hours_taught: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.date || !formData.subject || !formData.class_section || !formData.hours_taught) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/attendance", {
        teacher_id: teacherId,
        date: formData.date,
        subject: formData.subject,
        class_section: formData.class_section,
        hours_taught: parseFloat(formData.hours_taught)
      });

      if (response.data.success) {
        setSubmitted(true);
        setFormData({ date: "", subject: "", class_section: "", hours_taught: "" });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      setError("Failed to submit attendance");
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Submit Attendance</h2>
      {submitted && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">Attendance submitted successfully!</div>}
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Class Section</label>
          <input
            type="text"
            name="class_section"
            value={formData.class_section}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Hours Taught</label>
          <input
            type="number"
            name="hours_taught"
            value={formData.hours_taught}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            step="0.5"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const TeachingLoadView: React.FC<{ teacherId?: number }> = ({ teacherId }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teacherId) {
      fetchData();
    }
  }, [teacherId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/teaching-load/teacher/${teacherId}`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching teaching load:", error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Teaching Load</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600">No teaching load records</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Subject</th>
              <th className="border p-2 text-left">Class</th>
              <th className="border p-2 text-left">Hours/Week</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.subject}</td>
                <td className="border p-2">{item.class_section}</td>
                <td className="border p-2">{item.hours_per_week}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

interface Salary {
  id: number;
  period_start: string;
  period_end: string;
  verified_hours: number;
  basic_pay: number;
  allowances: number;
  deductions: number;
  total_salary: number;
  status: string;
}

const SalaryView: React.FC<{ teacherId?: number }> = ({ teacherId }) => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null);

  useEffect(() => {
    if (teacherId) {
      fetchSalaries();
    }
  }, [teacherId]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/salary/teacher/${teacherId}`);
      if (response.data.success) {
        setSalaries(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    if (selectedSalary) {
      window.print();
    }
  };

  const handleDownload = () => {
    if (selectedSalary) {
      const content = `
PAYSLIP
Period: ${selectedSalary.period_start} to ${selectedSalary.period_end}
Verified Hours: ${selectedSalary.verified_hours}
Basic Pay: ₱${selectedSalary.basic_pay.toLocaleString()}
Allowances: ₱${selectedSalary.allowances.toLocaleString()}
Deductions: ₱${selectedSalary.deductions.toLocaleString()}
Total Salary: ₱${selectedSalary.total_salary.toLocaleString()}
Status: ${selectedSalary.status}
      `;
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
      element.setAttribute("download", `Payslip_${selectedSalary.period_start}.txt`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Salary / Payslip View</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : salaries.length === 0 ? (
        <p className="text-center text-gray-600">No salary records found</p>
      ) : (
        <div className="space-y-4">
          {!selectedSalary ? (
            <div className="space-y-2">
              {salaries.map((salary) => (
                <div
                  key={salary.id}
                  onClick={() => setSelectedSalary(salary)}
                  className="p-4 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer"
                >
                  <p className="font-semibold">
                    {salary.period_start} to {salary.period_end}
                  </p>
                  <p className="text-sm text-gray-600">Total: ₱{salary.total_salary.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedSalary(null)}
                className="mb-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                ← Back
              </button>

              <div className="bg-gray-50 p-6 rounded border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Salary Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Period</p>
                    <p className="font-semibold">
                      {selectedSalary.period_start} to {selectedSalary.period_end}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Verified Hours</p>
                    <p className="font-semibold">{selectedSalary.verified_hours} hrs</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Basic Pay</p>
                    <p className="font-semibold">₱{selectedSalary.basic_pay.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Allowances</p>
                    <p className="font-semibold text-green-600">+₱{selectedSalary.allowances.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deductions</p>
                    <p className="font-semibold text-red-600">-₱{selectedSalary.deductions.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Total Salary</p>
                    <p className="text-xl font-bold text-blue-600">₱{selectedSalary.total_salary.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    🖨️ Print
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherHome;
