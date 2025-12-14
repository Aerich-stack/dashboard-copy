import api from "../services/api"; // adjust path to your axios instance

export const getAllTeachingLoads = () => api.get("/api/teaching-load");
export const getTeacherTeachingLoad = (teacherId: number) =>
  api.get(`/api/teaching-load/teacher/${teacherId}`);
export const createTeachingLoad = (data: any) =>
  api.post("/api/teaching-load", data);
export const updateTeachingLoad = (id: number, data: any) =>
  api.put(`/api/teaching-load/${id}`, data);
export const deleteTeachingLoad = (id: number) =>
  api.delete(`/api/teaching-load/${id}`);
export const markTeachingLoadAsDone = (id: number) =>
  api.patch(`/api/teaching-load/${id}/mark-done`);
export const approveTeachingLoad = (id: number) =>
  api.patch(`/api/teaching-load/${id}/approve`);
export const disapproveTeachingLoad = (id: number) =>
  api.patch(`/api/teaching-load/${id}/disapprove`);
