import { api } from './api';
export const register = (email: string, password: string) => api.post('/auth/register', { email, password });
export const login = (email: string, password: string) => api.post('/auth/login', { email, password });
export const setPin = (pin: string, userId: string) => api.post('/auth/pin', { pin }, { headers: { 'x-user-id': userId }});