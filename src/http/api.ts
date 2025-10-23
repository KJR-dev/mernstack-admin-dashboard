import type { CreateUserData, Credentials } from "../types";
import { api } from "./client";

// Auth service
export const login = (credentials: Credentials) => api.post('/api/v1/web/auth/login', credentials);
export const self = () => api.get('/api/v1/web/auth/self');
export const logout = () => api.post('/api/v1/web/auth/logout');

// User Service
export const getUsers = () => api.get('api/v1/web/user');
export const createUser = (user: CreateUserData) => api.post('api/v1/web/user',user);

// Tenant Service
export const getTenants = () => api.get('api/v1/web/tenants');