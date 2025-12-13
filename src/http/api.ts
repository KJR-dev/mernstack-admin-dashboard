import type { CreateTenant, CreateUserData, Credentials } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = '/api/v1/web/auth';
// const CATALOG_SERVICE = '/api/v1/catalog';

// Auth service
export const login = (credentials: Credentials) => api.post(`${AUTH_SERVICE}/api/v1/web/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/api/v1/web/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/api/v1/web/auth/logout`);

// Auth service (User)
export const getUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/api/v1/web/auth/user?${queryString}`);
export const createUser = (user: CreateUserData) => api.post(`${AUTH_SERVICE}/api/v1/web/auth/user`, user);
export const updateUser = (user: CreateUserData, id: number) => api.patch(`${AUTH_SERVICE}/api/v1/web/auth/user/${id}`, user);
export const deleteUser = (id: number) => api.delete(`${AUTH_SERVICE}/api/v1/web/auth/user/${id}`);

// Auth service (Tenant)
export const getTenants = (queryString: string) => api.get(`${AUTH_SERVICE}/api/v1/web/auth/tenants/?${queryString}`);
export const createTenant = (tenant: CreateTenant) => api.post(`${AUTH_SERVICE}/api/v1/web/auth/tenants`, tenant);
export const updateTenant = (tenant: CreateTenant, id: string) => api.put(`${AUTH_SERVICE}/api/v1/web/auth/tenants/${id}`, tenant);
export const deleteTenant = (id: string) => api.delete(`${AUTH_SERVICE}/api/v1/web/auth/tenants/${id}`);

// Catalog service
//Catalog service (Product)