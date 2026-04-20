import apiClient from './api';

export const familiesApi = {
    // Crear familia
    createFamily: async (data) => {
        const response = await apiClient.post('/families', data);
        return response.data;
    },

    // Obtener todas las familias
    getAllFamilies: async (skip = 0, take = 20, territorio = null) => {
        const params = { skip, take };
        if (territorio) params.territorio = territorio;
        const response = await apiClient.get('/families', { params });
        return response.data;
    },

    // Obtener familia por ID
    getFamilyById: async (id) => {
        const response = await apiClient.get(`/families/${id}`);
        return response.data;
    },

    // Obtener familia por código
    getFamilyByCode: async (code) => {
        const response = await apiClient.get(`/families/code/${code}`);
        return response.data;
    },

    // Actualizar familia
    updateFamily: async (id, data) => {
        const response = await apiClient.put(`/families/${id}`, data);
        return response.data;
    },

    // Desactivar familia
    deactivateFamily: async (id) => {
        const response = await apiClient.delete(`/families/${id}`);
        return response.data;
    },

    // Agregar miembro
    addMember: async (familyId, data) => {
        const response = await apiClient.post(`/families/${familyId}/members`, data);
        return response.data;
    },

    // Obtener miembros
    getFamilyMembers: async (familyId) => {
        const response = await apiClient.get(`/families/${familyId}/members`);
        return response.data;
    },

    // Detectar duplicados
    detectDuplicates: async (headOfFamily, municipio) => {
        const response = await apiClient.post('/families/detect-duplicates', {
            headOfFamily,
            municipio,
        });
        return response.data;
    },
};