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

// API para clientes
export const clienteAPI = {
  getAll: () => api.get(`${config.CLIENTES_ENDPOINT}`),
  getById: (id: number) => api.get(`${config.CLIENTES_ENDPOINT}/${id}`),
  create: (cliente: any) => api.post(`${config.CLIENTES_ENDPOINT}`, cliente),
  update: (id: number, cliente: any) => api.put(`${config.CLIENTES_ENDPOINT}/${id}`, cliente),
  delete: (id: number) => api.delete(`${config.CLIENTES_ENDPOINT}/${id}`),
  search: (query: string) => api.get(`${config.CLIENTES_ENDPOINT}/search?nombre=${query}&dni=${query}`),
  getRutinas: (clienteId: number) => api.get(`${config.CLIENTES_ENDPOINT}/${clienteId}/rutinas`)
};

// API para ejercicios
export const ejercicioAPI = {
  getAll: () => api.get(`${config.EJERCICIOS_ENDPOINT}`),
  getById: (id: number) => api.get(`${config.EJERCICIOS_ENDPOINT}/${id}`),
  create: (ejercicio: any) => api.post(`${config.EJERCICIOS_ENDPOINT}`, ejercicio),
  update: (id: number, ejercicio: any) => api.put(`${config.EJERCICIOS_ENDPOINT}/${id}`, ejercicio),
  delete: (id: number) => api.delete(`${config.EJERCICIOS_ENDPOINT}/${id}`),
  search: (nombre: string) => api.get(`${config.EJERCICIOS_ENDPOINT}/search?nombre=${nombre}`)
};

// API para rutinas
export const rutinaAPI = {
  getAll: () => api.get(`${config.RUTINAS_ENDPOINT}`),
  getById: (id: number) => api.get(`${config.RUTINAS_ENDPOINT}/${id}`),
  create: (rutina: any) => api.post(`${config.RUTINAS_ENDPOINT}`, rutina),
  update: (id: number, rutina: any) => api.put(`${config.RUTINAS_ENDPOINT}/${id}`, rutina),
  delete: (id: number) => api.delete(`${config.RUTINAS_ENDPOINT}/${id}`)
};

// API para cliente-rutinas
export const clienteRutinaAPI = {
  asignar: (clienteId: number, rutinaId: number) => 
    api.post(`${config.CLIENTE_RUTINAS_ENDPOINT}/asignar?clienteId=${clienteId}&rutinaId=${rutinaId}`),
  desasignar: (clienteId: number, rutinaId: number) => 
    api.delete(`${config.CLIENTE_RUTINAS_ENDPOINT}/desasignar?clienteId=${clienteId}&rutinaId=${rutinaId}`),
  getRutinasCliente: (clienteId: number) => 
    api.get(`${config.CLIENTE_RUTINAS_ENDPOINT}/rutinas?clienteId=${clienteId}`),
  getClienteRutina: (id: number) => 
    api.get(`${config.CLIENTE_RUTINAS_ENDPOINT}/${id}`),
  actualizarNotasEjercicio: (ejercicioId: number, notas: string) => 
    api.put(`${config.CLIENTE_RUTINAS_ENDPOINT}/ejercicios/${ejercicioId}/notas`, notas),
  actualizarEjercicio: (ejercicioId: number, reps: number, sets: number) => 
    api.put(`${config.CLIENTE_RUTINAS_ENDPOINT}/ejercicios/${ejercicioId}?reps=${reps}&sets=${sets}`)
};

// Exportamos la instancia api por defecto también
export default api;