import apiClient from './api';

export const casesApi = {
    createCase: (data) => apiClient.post('/cases', data).then(r => r.data),
    getAllCases: (params) => apiClient.get('/cases', { params }).then(r => r.data),
    getCaseById: (id) => apiClient.get(`/cases/${id}`).then(r => r.data),
    getCasesByFamily: (familyId) => apiClient.get(`/cases/family/${familyId}`).then(r => r.data),
    updateCase: (id, data) => apiClient.put(`/cases/${id}`, data).then(r => r.data),
    transitionCase: (id, data) => apiClient.put(`/cases/${id}/transition`, data).then(r => r.data),
    addIntervention: (caseId, data) => apiClient.post(`/cases/${caseId}/interventions`, data).then(r => r.data),
    getInterventions: (caseId) => apiClient.get(`/cases/${caseId}/interventions`).then(r => r.data),
    getStats: () => apiClient.get('/cases/stats').then(r => r.data),
};