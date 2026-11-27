import api from "./axios";

export const getAdminStatsApi = () => api.get("/admin/stats");
export const getAdminUsersApi = () => api.get("/admin/users");
export const getAdminPostsApi = () => api.get("/admin/posts");
export const getAdminReportsApi = () => api.get("/admin/reports");
export const getAdminFeedbackApi = () => api.get("/admin/feedback");

export const updateUserRoleApi = (id, role) => api.patch(`/admin/users/${id}/role`, { role });
export const updateReportApi = (id, status) => api.patch(`/admin/reports/${id}`, { status });
export const deleteAdminPostApi = (id) => api.delete(`/admin/posts/${id}`);
