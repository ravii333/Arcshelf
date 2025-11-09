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
export const fetchQuestions = () => API.get('/questions');
export const fetchQuestion = (id) => API.get(`/questions/${id}`);
export const createQuestion = (newQuestion) => API.post('/questions', newQuestion);

// Colleges Routes 
export const fetchColleges = () => API.get('/colleges');
export const createCollege = (newCollege) => API.post('/colleges', newCollege);

// University routes
export const fetchUniversities = () => API.get('/universities');
export const createUniversity = (newUniversity) => API.post('/universities', newUniversity);

export const fetchCollegesByUniversity = (universityId) => API.get(`/colleges/by-university/${universityId}`);