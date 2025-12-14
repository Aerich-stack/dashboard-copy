import api from "../services/api"; 

export const fetchDashboardStats = () =>
  api.get("/api/dashboard/stats");

export const fetchAttendanceSummary = () =>
  api.get("/api/dashboard/attendance-summary");

export const fetchSalarySummary = () =>
  api.get("/api/dashboard/salary-summary");

