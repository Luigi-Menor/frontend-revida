import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Reintentos automáticos en caso de fallo de red
axiosRetry(apiClient, {
    retries: 2,
    retryDelay: (retryCount) => retryCount * 1000,
    retryCondition: (error) => {
        return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            (error.response && error.response.status >= 500)
        );
    },
});

// Interceptor de request — agregar JWT al header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Variable para evitar bucles infinitos de renovación
let isRefreshing = false;
// Cola de requests que quedaron en espera mientras se renovaba el token
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Función para limpiar sesión y redirigir
const forceLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.replace('/login');
};

// Interceptor de response — manejar errores globales y token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || '';
        const originalRequest = error.config;

        // Log para depuración
        console.error(`[API Error] ${status} en ${requestUrl}:`, error.response?.data);

        // Si no es 401 o ya intentó renovar, rechazar directamente
        if (status !== 401) {
            return Promise.reject(error);
        }

        // Si el error es en login o refresh, cerrar sesión sin reintentar
        if (requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        // Si ya se marcó para reintentar, evitar bucle
        if (originalRequest._retry) {
            forceLogout();
            return Promise.reject(error);
        }

        // Si ya hay una renovación en curso, encolar esta request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        // Marcar que vamos a renovar el token
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            console.warn('[API] No hay refresh token. Cerrando sesión...');
            processQueue(error, null);
            isRefreshing = false;
            forceLogout();
            return Promise.reject(error);
        }

        try {
            console.info('[API] Access token expirado. Renovando...');
            // Usar axios directo para no pasar por el interceptor
            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;

            // Actualizar tokens en localStorage
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Actualizar el header por defecto
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

            // Procesar la cola de requests pendientes
            processQueue(null, newAccessToken);

            // Reintentar el request original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            console.warn('[API] No se pudo renovar el token. Cerrando sesión...');
            processQueue(refreshError, null);
            forceLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;