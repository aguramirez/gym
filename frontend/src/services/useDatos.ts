import { useState, useEffect } from 'react';
import { getClientes, getEjercicios, getRutinas } from './api'; // Importa tus funciones de API
import { Cliente } from '../models/Cliente';
import { Ejercicio } from '../models/Ejercicios';

const useDatos = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [rutinas, setRutinas] = useState([]);

  // Obtener clientes al cargar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const data = await getClientes(); // Función que obtiene los clientes desde la API
      setClientes(data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  // Obtener ejercicios al cargar el componente
  useEffect(() => {
    fetchEjercicios();
  }, []);

  const fetchEjercicios = async () => {
    try {
      const data = await getEjercicios(); // Función que obtiene los ejercicios desde la API
      setEjercicios(data);
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
    }
  };

  // Obtener rutinas al cargar el componente
  useEffect(() => {
    fetchRutinas();
  }, []);

  const fetchRutinas = async () => {
    try {
      const data = await getRutinas(); // Función que obtiene las rutinas desde la API
      setRutinas(data);
    } catch (error) {
      console.error('Error al obtener rutinas:', error);
    }
  };

  return { clientes, ejercicios, rutinas, fetchClientes, fetchEjercicios, fetchRutinas };
};

export default useDatos;