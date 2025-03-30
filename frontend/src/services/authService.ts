import axios from 'axios';

// Definiciones de tipos para autenticación
export interface AuthCredentials {
  nombre: string;
  dni: string;
}

export interface AuthResponse {
  token: string;
  clienteId: number;
  nombre: string;
  rol: string;
}

export interface User {
  clienteId: number;
  nombre: string;
  rol: string;
}

// URL base de la API
const API_URL = 'http://localhost:8080';

// Clase para manejar la autenticación
class AuthService {
  // Realiza la petición de login
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/login`, 
        credentials
      );
      
      // Guardar el token en localStorage
      if (response.data.token) {
        this.setSession(response.data);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Función para registrarse
  async register(userData: { nombre: string; dni: string; telefono: string }): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Función para cerrar sesión
  logout(): void {
    // Eliminar token y datos de usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('clienteId');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    
    // Eliminar el header de autorización de axios
    delete axios.defaults.headers.common['Authorization'];
  }

  // Función para guardar los datos de sesión
  private setSession(authResponse: AuthResponse): void {
    // Guardar el token con el prefijo "Bearer "
    const token = authResponse.token.startsWith('Bearer ') 
      ? authResponse.token 
      : `Bearer ${authResponse.token}`;
    
    localStorage.setItem('token', token);
    localStorage.setItem('clienteId', authResponse.clienteId.toString());
    localStorage.setItem('nombre', authResponse.nombre);
    localStorage.setItem('rol', authResponse.rol);
    
    // Configurar header de autorización para todas las peticiones
    axios.defaults.headers.common['Authorization'] = token;
    
    console.log('Token guardado:', token);
    console.log('Authorization header:', axios.defaults.headers.common['Authorization']);
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Convierte a booleano
  }

  // Obtiene el token JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtiene los datos del usuario actual
  getCurrentUser(): User | null {
    const clienteId = localStorage.getItem('clienteId');
    const nombre = localStorage.getItem('nombre');
    const rol = localStorage.getItem('rol');
    
    if (clienteId && nombre && rol) {
      return {
        clienteId: parseInt(clienteId, 10),
        nombre,
        rol
      };
    }
    
    return null;
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    
    // Normaliza el rol para comparación
    const userRole = user?.rol?.toUpperCase();
    const requiredRole = role.toUpperCase();
    
    // Permite coincidencias parciales (ADMIN coincide con ROLE_ADMIN)
    return user !== null && (
      userRole === requiredRole || 
      userRole === `ROLE_${requiredRole}` ||
      requiredRole === `ROLE_${userRole}`
    );
  }

  // Inicializa el servicio de autenticación (para llamar al inicio de la app)
  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      // Si hay un token en localStorage, configurar el header de axios
      axios.defaults.headers.common['Authorization'] = token;
      console.log('Inicializando auth con token:', token);
    }
  }
}

// Crear una instancia del servicio
const authService = new AuthService();

export default authService;