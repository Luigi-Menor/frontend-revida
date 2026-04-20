import { create } from 'zustand';
import apiClient from '../services/api';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
    isLoading: false,
    error: null,

    // Login
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken); // ← Guardar refresh token
            localStorage.setItem('user', JSON.stringify(user));

            set({ user, accessToken, isLoading: false });
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Error en login';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    // Register
    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/auth/register', userData);
            set({ isLoading: false });
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Error en registro';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    // Logout — limpiar todo
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({ user: null, accessToken: null });
    },

    // Limpiar error
    clearError: () => set({ error: null }),
}));