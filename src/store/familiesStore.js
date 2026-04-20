import { create } from 'zustand';
import { familiesApi } from '../services/familiesApi';

export const useFamiliesStore = create((set, get) => ({
    families: [],
    currentFamily: null,
    isLoading: false,
    error: null,
    pagination: { page: 1, total: 0, pages: 0 },

    // Obtener todas las familias
    fetchFamilies: async (skip = 0, take = 20, territorio = null) => {
        set({ isLoading: true, error: null });
        try {
            const result = await familiesApi.getAllFamilies(skip, take, territorio);
            set({
                families: result.data,
                pagination: { page: result.page, total: result.total, pages: result.pages },
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error al cargar familias', isLoading: false });
        }
    },

    // Obtener familia por ID
    fetchFamilyById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const family = await familiesApi.getFamilyById(id);
            set({ currentFamily: family, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error al cargar familia', isLoading: false });
        }
    },

    // Crear familia
    createFamily: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newFamily = await familiesApi.createFamily(data);
            set((state) => ({
                families: [newFamily, ...state.families],
                isLoading: false,
            }));
            return newFamily;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error al crear familia', isLoading: false });
            throw error;
        }
    },

    // Actualizar familia
    updateFamily: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await familiesApi.updateFamily(id, data);
            set((state) => ({
                families: state.families.map((f) => (f.id === id ? updated : f)),
                currentFamily: state.currentFamily?.id === id ? updated : state.currentFamily,
                isLoading: false,
            }));
            return updated;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error al actualizar familia', isLoading: false });
            throw error;
        }
    },

    // Desactivar familia
    deactivateFamily: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await familiesApi.deactivateFamily(id);
            set((state) => ({
                families: state.families.filter((f) => f.id !== id),
                currentFamily: state.currentFamily?.id === id ? null : state.currentFamily,
                isLoading: false,
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error al desactivar familia', isLoading: false });
        }
    },

    // Agregar miembro
    addMember: async (familyId, data) => {
        set({ isLoading: true, error: null });
        try {
            const member = await familiesApi.addMember(familyId, data);
            set((state) => ({
                currentFamily: state.currentFamily
                    ? { ...state.currentFamily, members: [...(state.currentFamily.members || []), member] }
                    : null,
                isLoading: false,
            }));
            return member;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error al agregar miembro', isLoading: false });
            throw error;
        }
    },

    // Detectar duplicados
    detectDuplicates: async (headOfFamily, municipio) => {
        set({ isLoading: true, error: null });
        try {
            const duplicates = await familiesApi.detectDuplicates(headOfFamily, municipio);
            set({ isLoading: false });
            return duplicates;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error al detectar duplicados', isLoading: false });
            return [];
        }
    },

    // Limpiar estado
    clearError: () => set({ error: null }),
    clearCurrentFamily: () => set({ currentFamily: null }),
}));