import { useState, useEffect, useCallback } from "react";
import { clienteAPI, ejercicioAPI, rutinaAPI } from "./api";

// Interfaces básicas para los tipos de datos
export interface Cliente {
    id: number;
    nombre: string;
    dni: string;
    telefono: string;
    rol: string;
}

export interface Ejercicio {
    id: number;
    nombre: string;
    video?: string;
}

export interface RutinaEjercicio {
    id: number;
    reps: number;
    sets: number;
    ejercicioId: number;
    ejercicioNombre?: string;
    ejercicioVideo?: string;
}

export interface RutinaDia {
    id: number;
    nombre: string;
    rutinaId: number;
    rutinaEjercicios: RutinaEjercicio[];
}

export interface Rutina {
    id: number;
    nombre: string;
    clienteId?: number;
    rutinaDias: RutinaDia[];
}

// Hook personalizado para manejar los datos
const useDatos = () => {
    // Estados para almacenar los datos
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
    const [rutinas, setRutinas] = useState<Rutina[]>([]);
    
    // Estados para manejar la carga y errores
    const [loadingClientes, setLoadingClientes] = useState<boolean>(false);
    const [loadingEjercicios, setLoadingEjercicios] = useState<boolean>(false);
    const [loadingRutinas, setLoadingRutinas] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener clientes
    const fetchClientes = useCallback(async (search?: string) => {
        try {
            setLoadingClientes(true);
            setError(null);
            const data = await clienteAPI.getAll(search);
            setClientes(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error al obtener clientes:", err);
            setError(err.message || "Error al obtener clientes");
            setClientes([]);
        } finally {
            setLoadingClientes(false);
        }
    }, []);

    // Función para obtener ejercicios
    const fetchEjercicios = useCallback(async (search?: string) => {
        try {
            setLoadingEjercicios(true);
            setError(null);
            const data = await ejercicioAPI.getAll(search);
            setEjercicios(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error al obtener ejercicios:", err);
            setError(err.message || "Error al obtener ejercicios");
            setEjercicios([]);
        } finally {
            setLoadingEjercicios(false);
        }
    }, []);

    // Función para obtener rutinas
    const fetchRutinas = useCallback(async () => {
        try {
            setLoadingRutinas(true);
            setError(null);
            const data = await rutinaAPI.getAll();
            setRutinas(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error al obtener rutinas:", err);
            setError(err.message || "Error al obtener rutinas");
            setRutinas([]);
        } finally {
            setLoadingRutinas(false);
        }
    }, []);

    // Cargar todos los datos al montar el componente
    useEffect(() => {
        fetchClientes();
        fetchEjercicios();
        fetchRutinas();
    }, [fetchClientes, fetchEjercicios, fetchRutinas]);

    // Retornar los estados y funciones
    return {
        // Datos
        clientes,
        ejercicios,
        rutinas,
        
        // Estados de carga
        loadingClientes,
        loadingEjercicios,
        loadingRutinas,
        
        // Error general
        error,
        
        // Funciones para actualizar datos
        fetchClientes,
        fetchEjercicios,
        fetchRutinas
    };
};

export default useDatos;