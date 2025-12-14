import axios from "axios";

const API_BASE_URL = "https://payroll-backend-8214.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==================== TEACHER API ==================== */
export const teacherAPI = {
  createTeacher: (teacherData: any) =>
    api.post("/api/teachers", teacherData),

  getAllTeachers: () =>
    api.get("/api/teachers"),

  getTeacherById: (id: number) =>
    api.get(`/api/teachers/${id}`),

  updateTeacher: (id: number, teacherData: any) =>
    api.put(`/api/teachers/${id}`, teacherData),

  deleteTeacher: (id: number) =>
    api.delete(`/api/teachers/${id}`),

  initializeTables: () =>
    api.post("/api/teachers/init"),
};

/* ==================== ATTENDANCE API ==================== */
export const attendanceAPI = {
  submitAttendance: (attendanceData: any) =>
    api.post("/api/attendance", attendanceData),

  getTeacherAttendance: (teacherId: number) =>
    api.get(`/api/attendance/teacher/${teacherId}`),

  getAllAttendance: () =>
    api.get("/api/attendance"),

  getAttendanceById: (id: number) =>
    api.get(`/api/attendance/${id}`),

  updateAttendance: (id: number, attendanceData: any) =>
    api.put(`/api/attendance/${id}`, attendanceData),

  approveAttendance: (id: number) =>
    api.patch(`/api/attendance/${id}/approve`),

  deleteAttendance: (id: number) =>
    api.delete(`/api/attendance/${id}`),

  initializeTables: () =>
    api.post("/api/attendance/init"),
};

/* ==================== TEACHING LOAD API ==================== */
export const teachingLoadAPI = {
  createTeachingLoad: (loadData: any) =>
    api.post("/api/teaching-load", loadData),

  getTeacherTeachingLoad: (teacherId: number) =>
    api.get(`/api/teaching-load/teacher/${teacherId}`),

  getAllTeachingLoads: () =>
    api.get("/api/teaching-load"),

  getTeachingLoadById: (id: number) =>
    api.get(`/api/teaching-load/${id}`),

  updateTeachingLoad: (id: number, loadData: any) =>
    api.put(`/api/teaching-load/${id}`, loadData),

  deleteTeachingLoad: (id: number) =>
    api.delete(`/api/teaching-load/${id}`),

  initializeTables: () =>
    api.post("/api/teaching-load/init"),
};

/* ==================== SALARY API ==================== */
export const salaryAPI = {
  computeSalary: (salaryData: any) =>
    api.post("/api/salary/compute", salaryData),

  getTeacherSalary: (teacherId: number) =>
    api.get(`/api/salary/teacher/${teacherId}`),

  getAllSalary: () =>
    api.get("/api/salary"),

  getSalaryById: (id: number) =>
    api.get(`/api/salary/${id}`),

  getSalarySummaryByPeriod: (periodStart: string, periodEnd: string) =>
    api.get(`/api/salary/period/${periodStart}/${periodEnd}`),

  updateSalary: (id: number, salaryData: any) =>
    api.put(`/api/salary/${id}`, salaryData),

  finalizeSalary: (id: number) =>
    api.patch(`/api/salary/${id}/finalize`),

  deleteSalary: (id: number) =>
    api.delete(`/api/salary/${id}`),

  initializeTables: () =>
    api.post("/api/salary/init"),
};

/* ==================== NOTIFICATION API ==================== */
export const notificationAPI = {
  createNotification: (notificationData: any) =>
    api.post("/api/notifications", notificationData),

  getAllNotifications: () =>
    api.get("/api/notifications"),

  getUnreadNotifications: () =>
    api.get("/api/notifications/unread"),

  markAsRead: (id: number) =>
    api.patch(`/api/notifications/${id}/read`),

  deleteNotification: (id: number) =>
    api.delete(`/api/notifications/${id}`),

  initializeTables: () =>
    api.post("/api/notifications/init"),
};

/* ==================== HEALTH CHECK ==================== */
export const healthCheck = () =>
  api.get("/api/health");

export default api;
