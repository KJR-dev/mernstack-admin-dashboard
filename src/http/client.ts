import axios from "axios";
import { useAuthStore } from "../store";
import { AUTH_SERVICE } from "./api";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',

    }
});

// const refreshToken = () => api.post('/api/v1/web/auth/refresh');

const refreshToken = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}${AUTH_SERVICE}/api/v1/web/auth/refresh`, {}, {
        withCredentials: true,
    })
}

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._isRetry) {
        try {
            originalRequest._isRetry = true;
            const headers = { ...originalRequest.headers }
            await refreshToken();
            return api.request({ ...originalRequest, headers });
        } catch (error) {
            console.error("Token refresh error", error);
            useAuthStore.getState().logout();
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
})