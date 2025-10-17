import type { Credentials } from "../types";
import { api } from "./client";

// Auth service
export const login = (credentials: Credentials) => api.post('/api/v1/web/auth/login', credentials);
export const self = () => api.get('/api/v1/web/auth/self');