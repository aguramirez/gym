// src/services/authService.ts
import axios from 'axios';
import { config } from '../config/api.config';

// Crear instancia de axios con URL base desde configuración
const apiClient = axios.create({
  baseURL: config.AUTH_ENDPOINT,
  headers: {
    'Content-type': 'application/json',
  },
});

// Información para depuración
console.log(`Inicializando servicio de autenticación con API URL: ${config.API_URL}`);

// Interceptor para agregar token a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token agregado a la solicitud');
    } else {
      console.log('No hay token disponible');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Objeto del servicio
const authService = {
  // Login
  login: async (nombre: string, dni: string) => {
    try {
      console.log(`Intentando login en: ${config.AUTH_ENDPOINT}/login con:`, { nombre, dni });
      const response = await apiClient.post('/login', { nombre, dni });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.clienteId,
          nombre: response.data.nombre,
          rol: response.data.rol
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Logout realizado, token eliminado');
  },

  // Registro
  register: async (userData: any) => {
    try {
      console.log(`Intentando registro en: ${config.AUTH_ENDPOINT}/register`);
      return await apiClient.post('/register', userData);
    } catch (error) {
      console.error('Error de registro:', error);
      throw error;
    }
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token ? 'Presente' : 'Ausente');
    return !!token;
  },

  // Check if user has specific role
  hasRole: (role: string) => {
    const user = authService.getCurrentUser();
    return user && user.rol === role;
  }
};

export default authService;