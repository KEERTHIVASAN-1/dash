import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
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

// Auth API
export const authAPI = {
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  logout: () => api.post('/api/auth/logout'),
  checkEmail: (email) => api.get(`/api/auth/check-email/${email}`),
};

// Questions API
export const questionsAPI = {
  // Return response data for easier consumption in components
  getAll: (params) => api.get('/api/questions', { params }).then(res => res.data),
  getById: (id) => api.get(`/api/questions/${id}`),
  create: (data) => api.post('/api/questions', data),
  update: (id, data) => api.put(`/api/questions/${id}`, data),
  delete: (id) => api.delete(`/api/questions/${id}`),
  like: (id) => api.post(`/api/questions/${id}/like`),
  resolve: (id) => api.patch(`/api/questions/${id}/resolve`),
  getUserQuestions: (userId, params) => api.get(`/api/questions/user/${userId}`, { params })
};

// Answers API
export const answersAPI = {
  getByQuestion: (questionId, params) => api.get(`/api/answers/question/${questionId}`, { params }),
  getByUser: (userId, params) => api.get(`/api/answers/user/${userId}`, { params }),
  create: (data) => api.post('/api/answers', data),
  update: (id, data) => api.put(`/api/answers/${id}`, data),
  delete: (id) => api.delete(`/api/answers/${id}`),
  like: (id) => api.post(`/api/answers/${id}/like`),
  accept: (id) => api.patch(`/api/answers/${id}/accept`),
  verify: (id) => api.patch(`/api/answers/${id}/verify`),
  getComments: (id, params) => api.get(`/api/answers/${id}/comments`, { params }),
  createComment: (id, data) => api.post(`/api/answers/${id}/comments`, data),
  addComment: (id, data) => api.post(`/api/answers/${id}/comments`, data), // Alias for createComment
  updateComment: (commentId, data) => api.put(`/api/answers/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/api/answers/comments/${commentId}`),
  likeComment: (commentId) => api.post(`/api/answers/comments/${commentId}/like`)
};

// Admin API
export const adminAPI = {
  // Return response data for consistent consumption across dashboard queries
  getStats: () => api.get('/api/admin/stats').then(res => res.data),
  getUsers: (params) => api.get('/api/admin/users', { params }).then(res => res.data),
  updateUserRole: (userId, role) => api.patch(`/api/admin/users/${userId}/role`, { role }),
  toggleUserStatus: (userId) => api.patch(`/api/admin/users/${userId}/status`),
  getQuestions: (params) => api.get('/api/admin/questions', { params }).then(res => res.data),
  archiveQuestion: (questionId) => api.patch(`/api/admin/questions/${questionId}/archive`),
  deleteQuestion: (questionId) => api.delete(`/api/admin/questions/${questionId}`),
  deleteAnswer: (answerId) => api.delete(`/api/admin/answers/${answerId}`),
  getLogs: () => api.get('/api/admin/logs').then(res => res.data),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/api/notifications'),
  markAsRead: (notificationId) => api.put(`/api/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/api/notifications/read-all'),
  delete: (notificationId) => api.delete(`/api/notifications/${notificationId}`),
};

export default api;
