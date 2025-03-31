// src/services/api.ts
import axios from 'axios';
import { config } from '../config/api.config';

// Crear instancia de axios con URL base desde configuración
const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token JWT a las solicitudes
api.interceptors.request.use(
  (config) => {
    // Obtener el token directamente de localStorage en lugar de usar authService
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token agregado a la solicitud API');
    } else {
      console.log('No hay token disponible para la solicitud API');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Error en solicitud API:', error.response?.status, error.message);
    
    // Si el error es 401 Unauthorized, podríamos hacer logout automático
    if (error.response && error.response.status === 401) {
      console.log('Sesión expirada o inválida');
      // No hacemos logout automático aquí para evitar dependencia circular
    }
    
    return Promise.reject(error);
  }
);

export default api;