// frontend/src/services/authService.js
import axiosInstance from './axiosConfig';

export const register = (userData) => axiosInstance.post('/auth/register', userData);
export const login = (userData) => axiosInstance.post('/auth/login', userData);