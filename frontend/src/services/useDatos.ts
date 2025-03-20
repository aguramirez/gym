import { useState, useEffect, useCallback } from "react";
import { getClientes, getEjercicios, getRutinas } from "./api"; // Importa tus funciones de API
import { Cliente } from "../models/Cliente";
import { Ejercicio } from "../models/Ejercicios";
import { Rutina } from "../models/Rutina";

const useDatos = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
    const [rutinas, setRutinas] = useState<Rutina[]>([]);

    // Funciones para obtener datos
    const fetchClientes = useCallback(async () => {
        try {
            const data = await getClientes();
            if (Array.isArray(data)) {
                setClientes(data);
            } else {
                console.error("La API no devolvió un array de clientes:", data);
                setClientes([]);
            }
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            setClientes([]);
        }
    }, []);

    const fetchEjercicios = useCallback(async () => {
        try {
            const data = await getEjercicios();
            if (Array.isArray(data)) {
                setEjercicios(data);
            } else {
                console.error("La API no devolvió un array de ejercicios:", data);
                setEjercicios([]);
            }
        } catch (error) {
            console.error("Error al obtener ejercicios:", error);
            setEjercicios([]);
        }
    }, []);

    const fetchRutinas = useCallback(async () => {
        try {
            const data = await getRutinas();
            if (Array.isArray(data)) {
                setRutinas(data);
            } else {
                console.error("La API no devolvió un array de rutinas:", data);
                setRutinas([]);
            }
        } catch (error) {
            console.error("Error al obtener rutinas:", error);
            setRutinas([]);
        }
    }, []);

    // Unificar los useEffect en un solo bloque
    useEffect(() => {
        fetchClientes();
        fetchEjercicios();
        fetchRutinas();
    }, [fetchClientes, fetchEjercicios, fetchRutinas]);

    return { clientes, ejercicios, rutinas, fetchClientes, fetchEjercicios, fetchRutinas };
};

export default useDatos;