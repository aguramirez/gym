import { NuevoEjercicio } from "../components/EjercicioForm";

export interface Ejercicio {
  id: number;
  nombre: string;
  link: string;
  reps: string;
  sets: number;
}

export interface EjercicioFormProps {
  onSave: (nuevoEjercicio: Ejercicio) => void; // Define el tipo de la función onSave
  initialData: NuevoEjercicio | null;
}