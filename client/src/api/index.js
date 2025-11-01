import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
});

// Auth routes
export const login = (formData) => API.post('/api/auth/login', formData);
export const register = (formData) => API.post('/api/auth/register', formData);

// Question routes
export const fetchQuestions = () => API.get('/api/questions');
export const fetchQuestion = (id) => API.get(`/api/questions/${id}`);
export const createQuestion = (newQuestion) => API.post('/api/questions', newQuestion);

// Colleges Routes 
export const fetchColleges = () => API.get('/api/colleges');
export const createCollege = (newCollege) => API.post('/api/colleges', newCollege);

// University routes
export const fetchUniversities = () => API.get('/api/universities');
export const createUniversity = (newUniversity) => API.post('/api/universities', newUniversity);

// --- THIS IS THE NEW SPECIAL ONE ---
export const fetchCollegesByUniversity = (universityId) => API.get(`/api/colleges/by-university/${universityId}`);