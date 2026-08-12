import api from './api';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadResume: (formData) => api.post('/users/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updatePassword: (data) => api.put('/users/password', data)
};
