import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== TEACHER API ====================
export const teacherAPI = {
  createTeacher: (teacherData: any) =>
    api.post("/teachers", teacherData),
  getAllTeachers: () =>
    api.get("/teachers"),
  getTeacherById: (id: number) =>
    api.get(`/teachers/${id}`),
  updateTeacher: (id: number, teacherData: any) =>
    api.put(`/teachers/${id}`, teacherData),
  deleteTeacher: (id: number) =>
    api.delete(`/teachers/${id}`),
  initializeTables: () =>
    api.post("/teachers/init"),
};

// ==================== ATTENDANCE API ====================
export const attendanceAPI = {
  submitAttendance: (attendanceData: any) =>
    api.post("/attendance", attendanceData),
  getTeacherAttendance: (teacherId: number) =>
    api.get(`/attendance/teacher/${teacherId}`),
  getAllAttendance: () =>
    api.get("/attendance"),
  getAttendanceById: (id: number) =>
    api.get(`/attendance/${id}`),
  updateAttendance: (id: number, attendanceData: any) =>
    api.put(`/attendance/${id}`, attendanceData),
  approveAttendance: (id: number) =>
    api.patch(`/attendance/${id}/approve`),
  deleteAttendance: (id: number) =>
    api.delete(`/attendance/${id}`),
  initializeTables: () =>
    api.post("/attendance/init"),
};

// ==================== TEACHING LOAD API ====================
export const teachingLoadAPI = {
  createTeachingLoad: (loadData: any) =>
    api.post("/teaching-load", loadData),
  getTeacherTeachingLoad: (teacherId: number) =>
    api.get(`/teaching-load/teacher/${teacherId}`),
  getAllTeachingLoads: () =>
    api.get("/teaching-load"),
  getTeachingLoadById: (id: number) =>
    api.get(`/teaching-load/${id}`),
  updateTeachingLoad: (id: number, loadData: any) =>
    api.put(`/teaching-load/${id}`, loadData),
  deleteTeachingLoad: (id: number) =>
    api.delete(`/teaching-load/${id}`),
  initializeTables: () =>
    api.post("/teaching-load/init"),
};

// ==================== SALARY API ====================
export const salaryAPI = {
  computeSalary: (salaryData: any) =>
    api.post("/salary/compute", salaryData),
  getTeacherSalary: (teacherId: number) =>
    api.get(`/salary/teacher/${teacherId}`),
  getAllSalary: () =>
    api.get("/salary"),
  getSalaryById: (id: number) =>
    api.get(`/salary/${id}`),
  getSalarySummaryByPeriod: (periodStart: string, periodEnd: string) =>
    api.get(`/salary/period/${periodStart}/${periodEnd}`),
  updateSalary: (id: number, salaryData: any) =>
    api.put(`/salary/${id}`, salaryData),
  finalizeSalary: (id: number) =>
    api.patch(`/salary/${id}/finalize`),
  deleteSalary: (id: number) =>
    api.delete(`/salary/${id}`),
  initializeTables: () =>
    api.post("/salary/init"),
};

// ==================== NOTIFICATION API ====================
export const notificationAPI = {
  createNotification: (notificationData: any) =>
    api.post("/notifications", notificationData),
  getAllNotifications: () =>
    api.get("/notifications"),
  getUnreadNotifications: () =>
    api.get("/notifications/unread"),
  markAsRead: (id: number) =>
    api.patch(`/notifications/${id}/read`),
  deleteNotification: (id: number) =>
    api.delete(`/notifications/${id}`),
  initializeTables: () =>
    api.post("/notifications/init"),
};

// ==================== HEALTH CHECK ====================
export const healthCheck = () =>
  api.get("/health");

export default api;
