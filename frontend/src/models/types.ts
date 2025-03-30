// Interfaces básicas para todos los modelos de la aplicación

// Cliente
export interface Cliente {
    id: number;
    nombre: string;
    dni: string;
    telefono: string;
    rol: string;
    clienteRutinas?: ClienteRutinaResumen[];
}

export interface ClienteResumen {
    id: number;
    nombre: string;
    dni: string;
}

export interface ClienteFormData {
    nombre: string;
    dni: string;
    telefono: string;
    rol?: string;
}

// Ejercicio
export interface Ejercicio {
    id: number;
    nombre: string;
    video?: string;
}

export interface EjercicioFormData {
    nombre: string;
    video?: string;
}

// Rutina
export interface Rutina {
    id: number;
    nombre: string;
    clienteId?: number;
    rutinaDias?: RutinaDia[];
}

export interface RutinaFormData {
    nombre: string;
    rutinaDias?: RutinaDiaFormData[];
}

// RutinaDia
export interface RutinaDia {
    id: number;
    nombre: string;
    rutinaId: number;
    rutinaEjercicios?: RutinaEjercicio[];
}

export interface RutinaDiaFormData {
    id?: number;
    nombre: string;
    rutinaEjercicios?: RutinaEjercicioFormData[];
}

// RutinaEjercicio
export interface RutinaEjercicio {
    id: number;
    reps: number;
    sets: number;
    ejercicioId: number;
    rutinaDiaId?: number;
    ejercicioNombre?: string;
    ejercicioVideo?: string;
}

export interface RutinaEjercicioFormData {
    ejercicioId: number;
    reps: number;
    sets: number;
}

// ClienteRutina
export interface ClienteRutina {
    id: number;
    nombre: string;
    clienteId: number;
    rutinaId: number;
    clienteRutinaDias?: ClienteRutinaDia[];
}

export interface ClienteRutinaResumen {
    id: number;
    nombre: string;
    rutinaId: number;
    rutinaOriginalNombre?: string;
    cantidadDias?: number;
}

// ClienteRutinaDia
export interface ClienteRutinaDia {
    id: number;
    nombre: string;
    clienteRutinaId: number;
    clienteRutinaEjercicios?: ClienteRutinaEjercicio[];
}

// ClienteRutinaEjercicio
export interface ClienteRutinaEjercicio {
    id: number;
    reps: number;
    sets: number;
    notas?: string;
    clienteRutinaDiaId: number;
    ejercicioId: number;
    ejercicioNombre?: string;
    ejercicioVideo?: string;
}

// Autenticación
export interface AuthCredentials {
    nombre: string;
    dni: string;
}

export interface RegisterData {
    nombre: string;
    dni: string;
    telefono: string;
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

// Genéricos
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}

// Estado de la aplicación
export interface AppState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: string | null;
}