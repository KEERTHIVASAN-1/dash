import axios from 'axios';

// Get Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log("🔥 Using API Base URL:", API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto redirect to login on expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---------------- AUTH ----------------
export const authAPI = {
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
  checkEmail: (email) => api.get(`/auth/check-email/${email}`),
};

// ---------------- QUESTIONS ----------------
export const questionsAPI = {
  getAll: (params) => api.get('/questions', { params }).then(res => res.data),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  like: (id) => api.post(`/questions/${id}/like`),
  resolve: (id) => api.patch(`/questions/${id}/resolve`),
  getUserQuestions: (userId, params) => api.get(`/questions/user/${userId}`, { params }),
};

// ---------------- ANSWERS ----------------
export const answersAPI = {
  getByQuestion: (qid, params) => api.get(`/answers/question/${qid}`, { params }),
  getByUser: (uid, params) => api.get(`/answers/user/${uid}`, { params }),
  create: (data) => api.post('/answers', data),
  update: (id, data) => api.put(`/answers/${id}`, data),
  delete: (id) => api.delete(`/answers/${id}`),
  like: (id) => api.post(`/answers/${id}/like`),
  accept: (id) => api.patch(`/answers/${id}/accept`),
  verify: (id) => api.patch(`/answers/${id}/verify`),
  getComments: (id, params) => api.get(`/answers/${id}/comments`, { params }),
  createComment: (id, data) => api.post(`/answers/${id}/comments`, data),
  updateComment: (cid, data) => api.put(`/answers/comments/${cid}`, data),
  deleteComment: (cid) => api.delete(`/answers/comments/${cid}`),
  likeComment: (cid) => api.post(`/answers/comments/${cid}/like`),
};

// ---------------- ADMIN ----------------
export const adminAPI = {
  getStats: () => api.get('/admin/stats').then(res => res.data),
  getUsers: (params) => api.get('/admin/users', { params }).then(res => res.data),
  updateUserRole: (uid, role) => api.patch(`/admin/users/${uid}/role`, { role }),
  toggleUserStatus: (uid) => api.patch(`/admin/users/${uid}/status`),
  getQuestions: (params) => api.get('/admin/questions', { params }).then(res => res.data),
  archiveQuestion: (qid) => api.patch(`/admin/questions/${qid}/archive`),
  deleteQuestion: (qid) => api.delete(`/admin/questions/${qid}`),
  deleteAnswer: (aid) => api.delete(`/admin/answers/${aid}`),
  getLogs: () => api.get('/admin/logs').then(res => res.data),
};

// ---------------- NOTIFICATIONS ----------------
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default api;
