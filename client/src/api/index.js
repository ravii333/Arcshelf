import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
});

// Auth routes
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// Question routes
// GET /questions returns a paginated envelope: { items, total, page, pages }.
export const fetchQuestions = (params) => API.get('/questions', { params });
export const fetchQuestion = (id) => API.get(`/questions/${id}`);
export const fetchRelatedQuestions = (id) => API.get(`/questions/${id}/related`);
export const createQuestion = (newQuestion) => API.post('/questions', newQuestion);

// Public stats for the homepage
export const fetchStats = () => API.get('/questions/stats');

// Admin / moderation routes
export const fetchPendingQuestions = () => API.get('/questions/pending');
export const fetchAdminQuestions = (params) => API.get('/questions/admin', { params });
export const updateQuestionStatus = (id, status, note) => API.patch(`/questions/${id}/status`, { status, note });

// Colleges Routes 
export const fetchColleges = () => API.get('/colleges');
export const createCollege = (newCollege) => API.post('/colleges', newCollege);

// University routes
export const fetchUniversities = () => API.get('/universities');
export const createUniversity = (newUniversity) => API.post('/universities', newUniversity);

export const fetchCollegesByUniversity = (universityId) => API.get(`/colleges/by-university/${universityId}`);

// Saved / Wishlist routes
export const fetchSavedPapers = () => API.get('/questions/saved');
export const toggleSavePaper = (id) => API.post(`/questions/${id}/save`);

// User Dashboard & Profile routes
export const fetchMyQuestions = () => API.get('/questions/my');
export const deleteQuestion = (id) => API.delete(`/questions/${id}`);
export const updateProfile = (formData) => API.patch('/auth/update-profile', formData);