import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import authService from './authService';

// Configuración base de axios
const API = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar el token a todas las peticiones
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken();
    if (token && config.headers) {
      // Usar el token tal como está almacenado (con prefijo Bearer)
      config.headers['Authorization'] = token;
      
      console.log('Enviando solicitud a:', config.url);
      console.log('Con token:', token);
    } else {
      console.log('No hay token disponible para la solicitud a:', config.url);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
API.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejar errores de autorización
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      authService.logout();
      window.location.href = '/'; // Redireccionar al login
      return Promise.reject(new Error('Sesión expirada. Por favor, inicie sesión nuevamente.'));
    }
    
    // Devolver mensaje de error amigable
    const errorMessage = error.response?.data && typeof error.response.data === 'object' 
      ? (error.response.data as any).message || 'Error en la petición'
      : error.message || 'Error en la petición';
    
    return Promise.reject(new Error(errorMessage));
  }
);

// API de clientes
export const clienteAPI = {
  getAll: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await API.get('/clientes', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await API.get(`/clientes/${id}`);
    return response.data;
  },
  
  create: async (cliente: any) => {
    const response = await API.post('/clientes', cliente);
    return response.data;
  },
  
  update: async (id: number, cliente: any) => {
    const response = await API.put(`/clientes/${id}`, cliente);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await API.delete(`/clientes/${id}`);
    return response.data;
  },
  
  getRutinas: async (clienteId: number) => {
    const response = await API.get(`/clientes/${clienteId}/rutinas`);
    return response.data;
  }
};

// API de ejercicios
export const ejercicioAPI = {
  getAll: async (search?: string) => {
    const params = search ? { nombre: search } : {};
    const response = await API.get('/ejercicios', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await API.get(`/ejercicios/${id}`);
    return response.data;
  },
  
  create: async (ejercicio: any) => {
    const response = await API.post('/ejercicios', ejercicio);
    return response.data;
  },
  
  update: async (id: number, ejercicio: any) => {
    const response = await API.put(`/ejercicios/${id}`, ejercicio);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await API.delete(`/ejercicios/${id}`);
    return response.data;
  },
  
  search: async (query: string) => {
    const response = await API.get(`/ejercicios/search?nombre=${query}`);
    return response.data;
  }
};

// API de rutinas
export const rutinaAPI = {
  getAll: async () => {
    const response = await API.get('/rutinas');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await API.get(`/rutinas/${id}`);
    return response.data;
  },
  
  create: async (rutina: any) => {
    const response = await API.post('/rutinas', rutina);
    return response.data;
  },
  
  update: async (id: number, rutina: any) => {
    const response = await API.put(`/rutinas/${id}`, rutina);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await API.delete(`/rutinas/${id}`);
    return response.data;
  }
};

// API de cliente-rutinas
export const clienteRutinaAPI = {
  asignarRutina: async (clienteId: number, rutinaId: number) => {
    const response = await API.post('/cliente-rutinas/asignar', null, {
      params: { clienteId, rutinaId }
    });
    return response.data;
  },
  
  desasignarRutina: async (clienteId: number, rutinaId: number) => {
    const response = await API.delete('/cliente-rutinas/desasignar', {
      params: { clienteId, rutinaId }
    });
    return response.data;
  },
  
  getRutinasCliente: async (clienteId: number) => {
    const response = await API.get('/cliente-rutinas/rutinas', {
      params: { clienteId }
    });
    return response.data;
  },
  
  getClienteRutina: async (id: number) => {
    const response = await API.get(`/cliente-rutinas/${id}`);
    return response.data;
  },
  
  actualizarNotasEjercicio: async (ejercicioId: number, notas: string) => {
    const response = await API.put(`/cliente-rutinas/ejercicios/${ejercicioId}/notas`, notas);
    return response.data;
  },
  
  actualizarEjercicio: async (ejercicioId: number, reps: number, sets: number) => {
    const response = await API.put(`/cliente-rutinas/ejercicios/${ejercicioId}`, null, {
      params: { reps, sets }
    });
    return response.data;
  }
};

// Exportación por defecto
export default {
  clienteAPI,
  ejercicioAPI,
  rutinaAPI,
  clienteRutinaAPI
};