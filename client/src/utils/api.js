import axios from "axios";

// MUST use import.meta.env for Vite
const API_BASE_URL = import.meta.env.VITE_API_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Debug
console.log("🔥 VITE API Base URL:", API_BASE_URL);
console.log("🔥 VITE GOOGLE CLIENT ID:", GOOGLE_CLIENT_ID);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  getProfile: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  logout: () => api.post("/auth/logout"),
  checkEmail: (email) => api.get(`/auth/check-email/${email}`),
};

export const questionsAPI = {
  getAll: (p) => api.get("/questions", { params: p }).then((res) => res.data),
  getById: (id) => api.get(`/questions/${id}`),
  create: (d) => api.post("/questions", d),
  update: (id, d) => api.put(`/questions/${id}`, d),
  delete: (id) => api.delete(`/questions/${id}`),
  like: (id) => api.post(`/questions/${id}/like`),
  resolve: (id) => api.patch(`/questions/${id}/resolve`),
  getUserQuestions: (uid, p) =>
    api.get(`/questions/user/${uid}`, { params: p }),
};

export default api;
