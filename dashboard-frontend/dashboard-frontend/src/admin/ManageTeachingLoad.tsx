import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://payroll-backend-8214.onrender.com/api/teaching-load";

interface TeachingLoad {
  id: number;
  teacher_id: number;
  teacher_name: string;
  subject: string;
  class_section: string;
  day: string;
  start_time: string;
  end_time: string;
  status: string;
  completion_status: string | null;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ManageTeachingLoad: React.FC = () => {
  const [loads, setLoads] = useState<TeachingLoad[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState<TeachingLoad | null>(null);

  const [form, setForm] = useState({
    teacher_id: "",
    subject: "",
    class_section: "",
    day: "",
    start_time: "",
    end_time: "",
  });

  // Fetch all loads
  const fetchLoads = async () => {
    const res = await axios.get(API);
    setLoads(res.data.data);
  };

  // Fetch teachers for dropdown
  const fetchTeachers = async () => {
    const res = await axios.get("https://payroll-backend-8214.onrender.com/api/teachers");
    setTeachers(res.data);
  };

  useEffect(() => {
    fetchLoads();
    fetchTeachers();
  }, []);

  // Compute hours
  const computeHours = (start: string, end: string) => {
    const s = new Date(`2000-01-01 ${start}`);
    const e = new Date(`2000-01-01 ${end}`);
    return (e.getTime() - s.getTime()) / (1000 * 60 * 60);
  };

  // Handle form change
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open modal for add
  const openAddModal = () => {
    setEditingLoad(null);
    setForm({
      teacher_id: "",
      subject: "",
      class_section: "",
      day: "",
      start_time: "",
      end_time: "",
    });
    setModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (load: TeachingLoad) => {
    setEditingLoad(load);
    setForm({
      teacher_id: String(load.teacher_id),
      subject: load.subject,
      class_section: load.class_section,
      day: load.day,
      start_time: load.start_time,
      end_time: load.end_time,
    });
    setModalOpen(true);
  };

  // Submit form
  const handleSubmit = async () => {
    if (editingLoad) {
      await axios.put(`${API}/${editingLoad.id}`, form);
    } else {
      await axios.post(API, form);
    }
    setModalOpen(false);
    fetchLoads();
  };

  // Delete load
  const deleteLoad = async (id: number) => {
    await axios.delete(`${API}/${id}`);
    fetchLoads();
  };

  // Approve
  const approveLoad = async (id: number) => {
    await axios.patch(`${API}/${id}/approve`);
    fetchLoads();
  };

  // Disapprove
  const disapproveLoad = async (id: number) => {
    await axios.patch(`${API}/${id}/disapprove`);
    fetchLoads();
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Manage Teaching Load</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Load
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-lg p-4">
        <table className="w-full text-white">
          <thead>
            <tr className="text-left border-b border-white/20">
              <th className="p-2">Teacher</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Section</th>
              <th className="p-2">Day</th>
              <th className="p-2">Time</th>
              <th className="p-2">Hours</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loads.map((load) => (
              <tr key={load.id} className="border-b border-white/10">
                <td className="p-2">{load.teacher_name}</td>
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
                    className={`px-2 py-1 rounded text-sm ${
                      load.completion_status === "approved"
                        ? "bg-green-600"
                        : load.completion_status === "pending"
                        ? "bg-yellow-600"
                        : load.completion_status === "disapproved"
                        ? "bg-red-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {load.completion_status || "None"}
                  </span>
                </td>

                <td className="p-2 space-x-2">
                  <button
                    onClick={() => openEditModal(load)}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteLoad(load.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => approveLoad(load.id)}
                    className="text-green-400 hover:underline"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => disapproveLoad(load.id)}
                    className="text-yellow-400 hover:underline"
                  >
                    Disapprove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 text-black space-y-4">

            <h2 className="text-xl font-bold">
              {editingLoad ? "Edit Teaching Load" : "Add Teaching Load"}
            </h2>

            {/* Teacher */}
            <select
              name="teacher_id"
              value={form.teacher_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Subject */}
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full p-2 border rounded"
            />

            {/* Section */}
            <input
              name="class_section"
              value={form.class_section}
              onChange={handleChange}
              placeholder="Class Section"
              className="w-full p-2 border rounded"
            />

            {/* Day */}
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Day</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Time */}
            <div className="flex gap-2">
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="w-1/2 p-2 border rounded"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editingLoad ? "Save Changes" : "Add Load"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeachingLoad;
