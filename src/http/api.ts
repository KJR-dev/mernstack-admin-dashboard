import type { CreateTenant, CreateUserData, Credentials } from "../types";
import { api } from "./client";

// Auth service
export const login = (credentials: Credentials) => api.post('/api/v1/web/auth/login', credentials);
export const self = () => api.get('/api/v1/web/auth/self');
export const logout = () => api.post('/api/v1/web/auth/logout');

// User Service
export const getUsers = (queryString: string) => api.get(`api/v1/web/user?${queryString}`);
export const createUser = (user: CreateUserData) => api.post('api/v1/web/user', user);
export const updateUser = (user: CreateUserData, id: number) => api.patch(`api/v1/web/user/${id}`, user);
export const deleteUser = (id: number) => api.delete(`api/v1/web/user/${id}`);

// Tenant Service
export const getTenants = () => api.get('api/v1/web/tenants');
export const createTenant = (tenant: CreateTenant) => api.post('api/v1/web/tenants',tenant);