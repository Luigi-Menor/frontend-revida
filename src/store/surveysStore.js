import { create } from 'zustand';
import { surveysApi } from '../services/surveysApi';

export const useSurveysStore = create((set, get) => ({
    templates: [],
    currentTemplate: null,
    currentResponse: null,
    familySurveys: [],
    isLoading: false,
    error: null,

    // ════════════════════════════════════════════════════════════
    // TEMPLATES
    // ════════════════════════════════════════════════════════════

    // Obtener todos los templates
    fetchTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
            const templates = await surveysApi.getAllTemplates(true);
            set({ templates, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error al cargar templates',
                isLoading: false,
            });
        }
    },

    // Obtener template por ID
    fetchTemplateById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const template = await surveysApi.getTemplateById(id);
            set({ currentTemplate: template, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error al cargar template',
                isLoading: false,
            });
        }
    },

    // Crear template
    createTemplate: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newTemplate = await surveysApi.createTemplate(data);
            set((state) => ({
                templates: [newTemplate, ...state.templates],
                isLoading: false,
            }));
            return newTemplate;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error al crear template',
                isLoading: false,
            });
            throw error;
        }
    },

    // Actualizar template
    updateTemplate: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await surveysApi.updateTemplate(id, data);
            set((state) => ({
                templates: [updated, ...state.templates.filter((t) => t.id !== id)],
                currentTemplate: updated,
                isLoading: false,
            }));
            return updated;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error al actualizar template',
                isLoading: false,
            });
            throw error;
        }
    },

    // ════════════════════════════════════════════════════════════
    // RESPONSES
    // ════════════════════════════════════════════════════════════

    // Obtener encuestas de una familia
    fetchFamilySurveys: async (familyId) => {
        set({ isLoading: true, error: null });
        try {
            const surveys = await surveysApi.getFamilySurveys(familyId);
            set({ familySurveys: surveys, isLoading: false });
        } catch (error) {
            set({
                error:
                    error.response?.data?.message || 'Error al cargar encuestas de familia',
                isLoading: false,
            });
        }
    },

    // Obtener respuesta por ID
    fetchResponseById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await surveysApi.getResponseById(id);
            set({ currentResponse: response, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error al cargar respuesta',
                isLoading: false,
            });
        }
    },

    // Crear respuesta
    createResponse: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newResponse = await surveysApi.createResponse(data);
            set((state) => ({
                familySurveys: [newResponse, ...state.familySurveys],
                isLoading: false,
            }));
            return newResponse;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error al crear respuesta',
                isLoading: false,
            });
            throw error;
        }
    },

    // Actualizar respuesta
    updateResponse: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await surveysApi.updateResponse(id, data);
            set((state) => ({
                currentResponse: updated,
                familySurveys: state.familySurveys.map((s) =>
                    s.id === id ? updated : s
                ),
                isLoading: false,
            }));
            return updated;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error al actualizar respuesta',
                isLoading: false,
            });
            throw error;
        }
    },

    // Limpiar estado
    clearError: () => set({ error: null }),
    clearCurrentTemplate: () => set({ currentTemplate: null }),
    clearCurrentResponse: () => set({ currentResponse: null }),
}));