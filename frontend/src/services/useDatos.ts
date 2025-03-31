// src/services/useDatos.ts
import { useState, useEffect, useCallback } from "react";
import api from "./api"; // Importar la instancia por defecto
import { config } from "../config/api.config";

// Interfaces básicas para los tipos de datos
interface Cliente {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  rol: string;
}

interface Ejercicio {
  id: number;
  nombre: string;
  video?: string;
}

interface Rutina {
  id: number;
  nombre: string;
  clienteId?: number;
  rutinaDias?: RutinaDia[];
}

interface RutinaDia {
  id: number;
  nombre: string;
  rutinaId: number;
  rutinaEjercicios?: RutinaEjercicio[];
}

interface RutinaEjercicio {
  id: number;
  reps: number;
  sets: number;
  ejercicioId: number;
  rutinaDiaId: number;
  ejercicioNombre?: string;
  ejercicioVideo?: string;
}

// Hook de clientes
export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`${config.CLIENTES_ENDPOINT}`);
      setClientes(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error al cargar clientes:", err);
      setError(err.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const getCliente = useCallback(async (id: number) => {
    try {
      const response = await api.get(`${config.CLIENTES_ENDPOINT}/${id}`);
      return response.data;
    } catch (err: any) {
      console.error(`Error al cargar cliente ${id}:`, err);
      throw err;
    }
  }, []);

  const createCliente = useCallback(async (cliente: Omit<Cliente, "id">) => {
    try {
      const response = await api.post(`${config.CLIENTES_ENDPOINT}`, cliente);
      await fetchClientes(); // Recargar lista después de crear
      return response.data;
    } catch (err: any) {
      console.error("Error al crear cliente:", err);
      throw err;
    }
  }, [fetchClientes]);

  const updateCliente = useCallback(async (id: number, cliente: Partial<Cliente>) => {
    try {
      const response = await api.put(`${config.CLIENTES_ENDPOINT}/${id}`, cliente);
      await fetchClientes(); // Recargar lista después de actualizar
      return response.data;
    } catch (err: any) {
      console.error(`Error al actualizar cliente ${id}:`, err);
      throw err;
    }
  }, [fetchClientes]);

  const deleteCliente = useCallback(async (id: number) => {
    try {
      await api.delete(`${config.CLIENTES_ENDPOINT}/${id}`);
      await fetchClientes(); // Recargar lista después de eliminar
      return true;
    } catch (err: any) {
      console.error(`Error al eliminar cliente ${id}:`, err);
      throw err;
    }
  }, [fetchClientes]);

  const searchClientes = useCallback(async (query: string) => {
    try {
      const response = await api.get(`${config.CLIENTES_ENDPOINT}/search?nombre=${query}&dni=${query}`);
      return response.data;
    } catch (err: any) {
      console.error("Error al buscar clientes:", err);
      throw err;
    }
  }, []);

  return {
    clientes,
    loading,
    error,
    fetchClientes,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente,
    searchClientes
  };
};

// Hook de ejercicios
export const useEjercicios = () => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEjercicios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`${config.EJERCICIOS_ENDPOINT}`);
      setEjercicios(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error al cargar ejercicios:", err);
      setError(err.message || "Error al cargar ejercicios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEjercicios();
  }, [fetchEjercicios]);

  const getEjercicio = useCallback(async (id: number) => {
    try {
      const response = await api.get(`${config.EJERCICIOS_ENDPOINT}/${id}`);
      return response.data;
    } catch (err: any) {
      console.error(`Error al cargar ejercicio ${id}:`, err);
      throw err;
    }
  }, []);

  const createEjercicio = useCallback(async (ejercicio: Omit<Ejercicio, "id">) => {
    try {
      const response = await api.post(`${config.EJERCICIOS_ENDPOINT}`, ejercicio);
      await fetchEjercicios(); // Recargar lista después de crear
      return response.data;
    } catch (err: any) {
      console.error("Error al crear ejercicio:", err);
      throw err;
    }
  }, [fetchEjercicios]);

  const updateEjercicio = useCallback(async (id: number, ejercicio: Partial<Ejercicio>) => {
    try {
      const response = await api.put(`${config.EJERCICIOS_ENDPOINT}/${id}`, ejercicio);
      await fetchEjercicios(); // Recargar lista después de actualizar
      return response.data;
    } catch (err: any) {
      console.error(`Error al actualizar ejercicio ${id}:`, err);
      throw err;
    }
  }, [fetchEjercicios]);

  const deleteEjercicio = useCallback(async (id: number) => {
    try {
      await api.delete(`${config.EJERCICIOS_ENDPOINT}/${id}`);
      await fetchEjercicios(); // Recargar lista después de eliminar
      return true;
    } catch (err: any) {
      console.error(`Error al eliminar ejercicio ${id}:`, err);
      throw err;
    }
  }, [fetchEjercicios]);

  const searchEjercicios = useCallback(async (nombre: string) => {
    try {
      const response = await api.get(`${config.EJERCICIOS_ENDPOINT}/search?nombre=${nombre}`);
      return response.data;
    } catch (err: any) {
      console.error("Error al buscar ejercicios:", err);
      throw err;
    }
  }, []);

  return {
    ejercicios,
    loading,
    error,
    fetchEjercicios,
    getEjercicio,
    createEjercicio,
    updateEjercicio,
    deleteEjercicio,
    searchEjercicios
  };
};

// Hook de rutinas
export const useRutinas = () => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRutinas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`${config.RUTINAS_ENDPOINT}`);
      setRutinas(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error al cargar rutinas:", err);
      setError(err.message || "Error al cargar rutinas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRutinas();
  }, [fetchRutinas]);

  const getRutina = useCallback(async (id: number) => {
    try {
      const response = await api.get(`${config.RUTINAS_ENDPOINT}/${id}`);
      return response.data;
    } catch (err: any) {
      console.error(`Error al cargar rutina ${id}:`, err);
      throw err;
    }
  }, []);

  const createRutina = useCallback(async (rutina: Omit<Rutina, "id">) => {
    try {
      const response = await api.post(`${config.RUTINAS_ENDPOINT}`, rutina);
      await fetchRutinas(); // Recargar lista después de crear
      return response.data;
    } catch (err: any) {
      console.error("Error al crear rutina:", err);
      throw err;
    }
  }, [fetchRutinas]);

  const updateRutina = useCallback(async (id: number, rutina: Partial<Rutina>) => {
    try {
      const response = await api.put(`${config.RUTINAS_ENDPOINT}/${id}`, rutina);
      await fetchRutinas(); // Recargar lista después de actualizar
      return response.data;
    } catch (err: any) {
      console.error(`Error al actualizar rutina ${id}:`, err);
      throw err;
    }
  }, [fetchRutinas]);

  const deleteRutina = useCallback(async (id: number) => {
    try {
      await api.delete(`${config.RUTINAS_ENDPOINT}/${id}`);
      await fetchRutinas(); // Recargar lista después de eliminar
      return true;
    } catch (err: any) {
      console.error(`Error al eliminar rutina ${id}:`, err);
      throw err;
    }
  }, [fetchRutinas]);

  return {
    rutinas,
    loading,
    error,
    fetchRutinas,
    getRutina,
    createRutina,
    updateRutina,
    deleteRutina
  };
};

// Hook para cliente-rutinas
export const useClienteRutinas = () => {
  const asignarRutina = useCallback(async (clienteId: number, rutinaId: number) => {
    try {
      const response = await api.post(`${config.CLIENTE_RUTINAS_ENDPOINT}/asignar?clienteId=${clienteId}&rutinaId=${rutinaId}`);
      return response.data;
    } catch (err: any) {
      console.error(`Error al asignar rutina ${rutinaId} a cliente ${clienteId}:`, err);
      throw err;
    }
  }, []);

  const desasignarRutina = useCallback(async (clienteId: number, rutinaId: number) => {
    try {
      await api.delete(`${config.CLIENTE_RUTINAS_ENDPOINT}/desasignar?clienteId=${clienteId}&rutinaId=${rutinaId}`);
      return true;
    } catch (err: any) {
      console.error(`Error al desasignar rutina ${rutinaId} de cliente ${clienteId}:`, err);
      throw err;
    }
  }, []);

  const getRutinasCliente = useCallback(async (clienteId: number) => {
    try {
      const response = await api.get(`${config.CLIENTE_RUTINAS_ENDPOINT}/rutinas?clienteId=${clienteId}`);
      return response.data;
    } catch (err: any) {
      console.error(`Error al obtener rutinas del cliente ${clienteId}:`, err);
      throw err;
    }
  }, []);

  const getClienteRutina = useCallback(async (id: number) => {
    try {
      const response = await api.get(`${config.CLIENTE_RUTINAS_ENDPOINT}/${id}`);
      return response.data;
    } catch (err: any) {
      console.error(`Error al obtener rutina de cliente ${id}:`, err);
      throw err;
    }
  }, []);

  const actualizarNotasEjercicio = useCallback(async (ejercicioId: number, notas: string) => {
    try {
      const response = await api.put(`${config.CLIENTE_RUTINAS_ENDPOINT}/ejercicios/${ejercicioId}/notas`, notas);
      return response.data;
    } catch (err: any) {
      console.error(`Error al actualizar notas del ejercicio ${ejercicioId}:`, err);
      throw err;
    }
  }, []);

  const actualizarEjercicio = useCallback(async (ejercicioId: number, reps: number, sets: number) => {
    try {
      const response = await api.put(`${config.CLIENTE_RUTINAS_ENDPOINT}/ejercicios/${ejercicioId}?reps=${reps}&sets=${sets}`);
      return response.data;
    } catch (err: any) {
      console.error(`Error al actualizar ejercicio ${ejercicioId}:`, err);
      throw err;
    }
  }, []);

  return {
    asignarRutina,
    desasignarRutina,
    getRutinasCliente,
    getClienteRutina,
    actualizarNotasEjercicio,
    actualizarEjercicio
  };
};

// Exportamos todos los hooks individualmente
const useDatos = {
  useClientes,
  useEjercicios,
  useRutinas,
  useClienteRutinas
};

// Exportación por defecto para compatibilidad con el código existente
export default useDatos;