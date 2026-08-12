import api from './api';

export const applicationService = {
  applyForJob: (jobId, data) => {
    if (data instanceof FormData) {
      return api.post(`/applications/${jobId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post(`/applications/${jobId}`, data);
  },
  getMyApplications: () => api.get('/applications/my-applications'),
  getJobApplicants: (jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status })
};
