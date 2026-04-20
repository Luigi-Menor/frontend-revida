import apiClient from './api';

export const surveysApi = {
    // ════════════════════════════════════════════════════════════
    // TEMPLATES
    // ════════════════════════════════════════════════════════════

    // Crear template
    createTemplate: async (data) => {
        const response = await apiClient.post('/surveys/templates', data);
        return response.data;
    },

    // Obtener todos los templates
    getAllTemplates: async (activeOnly = true) => {
        const response = await apiClient.get('/surveys/templates', {
            params: { activeOnly },
        });
        return response.data;
    },

    // Obtener template por ID
    getTemplateById: async (id) => {
        const response = await apiClient.get(`/surveys/templates/${id}`);
        return response.data;
    },

    // Actualizar template
    updateTemplate: async (id, data) => {
        const response = await apiClient.put(`/surveys/templates/${id}`, data);
        return response.data;
    },

    // ════════════════════════════════════════════════════════════
    // RESPONSES
    // ════════════════════════════════════════════════════════════

    // Crear respuesta
    createResponse: async (data) => {
        const response = await apiClient.post('/surveys/responses', data);
        return response.data;
    },

    // Obtener encuestas de una familia
    getFamilySurveys: async (familyId) => {
        const response = await apiClient.get(`/surveys/family/${familyId}`);
        return response.data;
    },

    // Obtener respuesta por ID
    getResponseById: async (id) => {
        const response = await apiClient.get(`/surveys/responses/${id}`);
        return response.data;
    },

    // Actualizar respuesta
    updateResponse: async (id, data) => {
        const response = await apiClient.put(`/surveys/responses/${id}`, data);
        return response.data;
    },

    // Obtener respuestas por template
    getResponsesByTemplate: async (templateId) => {
        const response = await apiClient.get(
            `/surveys/template/${templateId}/responses`
        );
        return response.data;
    },
};