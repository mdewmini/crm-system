import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

export const getDashboard = () => API.get('/dashboard');

export const getLeads = (params) => API.get('/leads', { params });
export const getLeadById = (id) => API.get(`/leads/${id}`);
export const createLead = (data) => API.post('/leads', data);
export const updateLead = (id, data) => API.put(`/leads/${id}`, data);
export const deleteLead = (id) => API.delete(`/leads/${id}`);

export const addNote = (leadId, data) => API.post(`/leads/${leadId}/notes`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);

export const getUsers = () => API.get('/users');