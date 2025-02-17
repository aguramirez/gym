import React, { useState } from 'react';

type Ejercicio = {
  id: number;
  nombre: string;
};

type RutinaDiaFormProps = {
  onSave: (dia: { nombre: string; rutinaEjercicios: any[] }) => void;
  ejercicios: Ejercicio[];
};

const RutinaDiaForm: React.FC<RutinaDiaFormProps> = ({ onSave, ejercicios }) => {
  const [nombre, setNombre] = useState('');
  const [rutinaEjercicios, setRutinaEjercicios] = useState<any[]>([]);
  const [selectedEjercicio, setSelectedEjercicio] = useState<number | null>(null);
  const [reps, setReps] = useState<number>(0);
  const [sets, setSets] = useState<number>(0);

  const handleAddEjercicio = () => {
    if (selectedEjercicio !== null) {
      const ejercicio = ejercicios.find((e) => e.id === selectedEjercicio);
      if (ejercicio) {
        setRutinaEjercicios([
          ...rutinaEjercicios,
          { 
            ejercicio, // Estructura esperada por el backend
            reps,
            sets,
          },
        ]);
      }
      setSelectedEjercicio(null);
      setReps(0);
      setSets(0);
    }
  };

  const handleSubmit = () => {
    onSave({ nombre, rutinaEjercicios });
  };

  return (
    <div className="p-4 bg-dark text-light">
      <h2 className="text-xl font-bold mb-4">Agregar Día</h2>
      <div className="mb-3">
        <input
          className="form-control bg-secondary text-light"
          placeholder="Nombre del día"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <select
          className="form-select bg-secondary text-light"
          value={selectedEjercicio || ''}
          onChange={(e) => setSelectedEjercicio(Number(e.target.value))}
        >
          <option value="">Seleccionar ejercicio</option>
          {ejercicios.map((ejercicio) => (
            <option key={ejercicio.id} value={ejercicio.id}>
              {ejercicio.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedEjercicio && (
        <div className="mb-3">
          <input
            className="form-control bg-secondary text-light"
            placeholder="Reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
          />
          <input
            className="form-control bg-secondary text-light mt-2"
            placeholder="Sets"
            type="number"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
          />
          <button className="btn btn-primary mt-2" onClick={handleAddEjercicio}>Agregar Ejercicio</button>
        </div>
      )}

      <ul className="list-group mb-3">
        {rutinaEjercicios.map((ej, index) => (
          <li key={index} className="list-group-item bg-secondary text-light">
            {ej.ejercicio.nombre} - {ej.reps} reps x {ej.sets} sets
          </li>
        ))}
      </ul>

      <button className="btn btn-success" onClick={handleSubmit}>Guardar Día</button>
    </div>
  );
};

export default RutinaDiaForm;