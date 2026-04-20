import { create } from 'zustand';
import { casesApi } from '../services/casesApi';

export const useCasesStore = create((set, get) => ({
    cases: [], currentCase: null, interventions: [],
    stats: null, isLoading: false, error: null,

    fetchCases: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const result = await casesApi.getAllCases(params);
            set({ cases: result.data, isLoading: false });
        } catch (e) {
            set({ error: e.response?.data?.message || 'Error al cargar casos', isLoading: false });
        }
    },

    fetchCaseById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const caso = await casesApi.getCaseById(id);
            set({ currentCase: caso, interventions: caso.interventions || [], isLoading: false });
        } catch (e) {
            set({ error: e.response?.data?.message || 'Error al cargar caso', isLoading: false });
        }
    },

    fetchCasesByFamily: async (familyId) => {
        set({ isLoading: true, error: null });
        try {
            const cases = await casesApi.getCasesByFamily(familyId);
            set({ cases, isLoading: false });
        } catch (e) {
            set({ error: e.response?.data?.message || 'Error', isLoading: false });
        }
    },

    createCase: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newCase = await casesApi.createCase(data);
            set((s) => ({ cases: [newCase, ...s.cases], isLoading: false }));
            return newCase;
        } catch (e) {
            set({ error: e.response?.data?.message || 'Error al crear caso', isLoading: false });
            throw e;
        }
    },

    transitionCase: async (id, newState, reason) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await casesApi.transitionCase(id, { newState, reason });
            set((s) => ({
                cases: s.cases.map((c) => (c.id === id ? updated : c)),
                currentCase: s.currentCase?.id === id ? { ...s.currentCase, state: updated.state } : s.currentCase,
                isLoading: false,
            }));
            return updated;
        } catch (e) {
            set({ error: e.response?.data?.message || 'Transición inválida', isLoading: false });
            throw e;
        }
    },

    addIntervention: async (caseId, data) => {
        set({ isLoading: true, error: null });
        try {
            const intervention = await casesApi.addIntervention(caseId, data);
            set((s) => ({ interventions: [...s.interventions, intervention], isLoading: false }));
            return intervention;
        } catch (e) {
            set({ error: e.response?.data?.message || 'Error al registrar intervención', isLoading: false });
            throw e;
        }
    },

    fetchStats: async () => {
        try {
            const stats = await casesApi.getStats();
            set({ stats });
        } catch (e) {
            console.warn('No se pudieron cargar stats');
        }
    },

    clearError: () => set({ error: null }),
}));