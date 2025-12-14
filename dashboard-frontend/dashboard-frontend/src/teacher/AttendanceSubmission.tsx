import React, { useState } from "react";
import axios from "axios";

const API = "https://payroll-backend-8214.onrender.com/api/attendance";

interface Props {
  teacherId?: number;
}

const AttendanceSubmission: React.FC<Props> = ({ teacherId }) => {
  const [formData, setFormData] = useState({
    date: "",
    subject: "",
    class_section: "",
    hours_taught: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!teacherId) return;

    try {
      const res = await axios.post(API, {
        teacher_id: teacherId,
        ...formData,
      });

      if (res.data.success) {
        setMessage("Attendance submitted successfully!");
        setFormData({
          date: "",
          subject: "",
          class_section: "",
          hours_taught: "",
        });
      }
    } catch (err) {
      setMessage("Error submitting attendance.");
      console.error(err);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-white border border-white/20">
      <h2 className="text-xl font-bold mb-4">Submit Attendance</h2>

      <div className="space-y-3">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/20 border border-white/30"
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/20 border border-white/30"
        />

        <input
          type="text"
          name="class_section"
          placeholder="Class Section"
          value={formData.class_section}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/20 border border-white/30"
        />

        <input
          type="number"
          name="hours_taught"
          placeholder="Hours Taught"
          value={formData.hours_taught}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/20 border border-white/30"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mt-2"
        >
          Submit Attendance
        </button>

        {message && (
          <p className="text-center mt-3 text-sm opacity-80">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AttendanceSubmission;
