import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://payroll-backend-8214.onrender.com/api/salary";

interface SalaryRecord {
  id: number;
  period_start: string;
  period_end: string;
  verified_hours: number;
  hourly_rate: number;
  basic_pay: number;
  allowances: number;
  deductions: number;
  total_salary: number;
  status: string;
}

const SalaryView: React.FC<{ teacherId?: number }> = ({ teacherId }) => {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSalary = async () => {
    if (!teacherId) return;

    try {
      const res = await axios.get(`${API}/teacher/${teacherId}`);
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching salary:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSalary();
  }, [teacherId]);

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 text-white">
      <h2 className="text-2xl font-bold mb-4">Salary Records</h2>

      {loading && <p className="animate-pulse">Loading salary data...</p>}

      {!loading && records.length === 0 && (
        <p className="opacity-80">No salary records found.</p>
      )}

      <div className="space-y-4">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="bg-white/20 p-4 rounded-lg border border-white/30 hover:bg-white/30 transition-all"
          >
            <p className="font-semibold text-lg">
              {rec.period_start} → {rec.period_end}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <p>Verified Hours: {rec.verified_hours}</p>
              <p>Hourly Rate: ₱{rec.hourly_rate}</p>
              <p>Basic Pay: ₱{rec.basic_pay.toLocaleString()}</p>
              <p>Allowances: ₱{rec.allowances.toLocaleString()}</p>
              <p>Deductions: ₱{rec.deductions.toLocaleString()}</p>
              <p className="font-bold text-green-300">
                Total: ₱{rec.total_salary.toLocaleString()}
              </p>
            </div>

            <p className="mt-2 text-sm opacity-80">
              Status:{" "}
              <span
                className={
                  rec.status === "Finalized"
                    ? "text-green-400"
                    : "text-yellow-300"
                }
              >
                {rec.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalaryView;
