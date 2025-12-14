import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://payroll-backend-8214.onrender.com/api/teaching-load";

interface TeachingLoad {
  id: number;
  subject: string;
  class_section: string;
  day: string;
  start_time: string;
  end_time: string;
  completion_status: string | null;
}

interface Props {
  teacherId: number;
}

const TeacherTeachingLoad: React.FC<Props> = ({ teacherId }) => {
  const [loads, setLoads] = useState<TeachingLoad[]>([]);

  const fetchLoads = async () => {
    const res = await axios.get(`${API}/teacher/${teacherId}`);
    setLoads(res.data.data);
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  const computeHours = (start: string, end: string) => {
    const s = new Date(`2000-01-01 ${start}`);
    const e = new Date(`2000-01-01 ${end}`);
    return (e.getTime() - s.getTime()) / (1000 * 60 * 60);
  };

  const markDone = async (id: number) => {
    await axios.patch(`${API}/${id}/mark-done`);
    fetchLoads();
  };

  const statusColor = (status: string | null) => {
    switch (status) {
      case "approved":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      case "disapproved":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-white">My Teaching Load</h1>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block bg-white/10 backdrop-blur-md rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-white/20">
              <th className="p-2">Subject</th>
              <th className="p-2">Section</th>
              <th className="p-2">Day</th>
              <th className="p-2">Time</th>
              <th className="p-2">Hours</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {loads.map((load) => (
              <tr key={load.id} className="border-b border-white/10">
                <td className="p-2">{load.subject}</td>
                <td className="p-2">{load.class_section}</td>
                <td className="p-2">{load.day}</td>
                <td className="p-2">
                  {load.start_time} - {load.end_time}
                </td>
                <td className="p-2">
                  {computeHours(load.start_time, load.end_time)} hrs
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${statusColor(
                      load.completion_status
                    )}`}
                  >
                    {load.completion_status || "None"}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => markDone(load.id)}
                    className="text-blue-400 hover:underline"
                  >
                    Mark Done
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loads.map((load) => (
          <div
            key={load.id}
            className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white"
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{load.subject}</h2>
              <span
                className={`px-2 py-1 rounded text-sm ${statusColor(
                  load.completion_status
                )}`}
              >
                {load.completion_status || "None"}
              </span>
            </div>

            <p className="text-sm opacity-80">{load.class_section}</p>
            <p className="mt-2">{load.day}</p>

            <p className="text-sm opacity-80">
              {load.start_time} - {load.end_time}
            </p>

            <p className="mt-1">
              <strong>{computeHours(load.start_time, load.end_time)}</strong> hrs
            </p>

            <button
              onClick={() => markDone(load.id)}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Mark Done
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherTeachingLoad;
