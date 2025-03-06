import React, { useState } from 'react';

type Ejercicio = {
  id: number;
  nombre: string;
};

type RutinaDiaFormProps = {
  onSave: (dia: { id?: number; nombre: string; rutinaEjercicios: any[] }) => void;
  ejercicios: Ejercicio[];
  dia?: { id?: number; nombre: string; rutinaEjercicios: any[] } | null; // Día existente para editar
};

const RutinaDiaForm: React.FC<RutinaDiaFormProps> = ({ onSave, ejercicios, dia }) => {
  const [nombre, setNombre] = useState(dia?.nombre || "");
  const [rutinaEjercicios, setRutinaEjercicios] = useState<any[]>(
    dia?.rutinaEjercicios || []
  );
  const [selectedEjercicio, setSelectedEjercicio] = useState<number | null>(
    null
  );
  const [reps, setReps] = useState<number>(0);
  const [sets, setSets] = useState<number>(0);

  const handleAddEjercicio = () => {
    if (selectedEjercicio !== null) {
      const ejercicio = ejercicios.find((e) => e.id === selectedEjercicio);
      if (ejercicio) {
        setRutinaEjercicios([
          ...rutinaEjercicios,
          {
            ejercicio,
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

  const handleEditEjercicio = (id: number, field: string, value: number) => {
    setRutinaEjercicios((prev) =>
      prev.map((ej) =>
        ej.id === id ? { ...ej, [field]: value } : ej
      )
    );
  };

  const handleDeleteEjercicio = (id: number) => {
    setRutinaEjercicios((prev) => prev.filter((ej) => ej.id !== id));
  };

  const handleSubmit = () => {
    onSave({ id: dia?.id, nombre, rutinaEjercicios });
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
          <button className="btn btn-primary mt-2" onClick={handleAddEjercicio}>
            Agregar Ejercicio
          </button>
        </div>
      )}

      <ul className="list-group mb-3">
        {rutinaEjercicios.map((ej) => (
          <li key={ej.id} className="list-group-item bg-secondary text-light">
            <div className="d-flex align-items-center justify-content-between">
              <span>{ej.ejercicio.nombre}</span>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control bg-dark text-light"
                  value={ej.reps}
                  onChange={(e) => handleEditEjercicio(ej.id, 'reps', Number(e.target.value))}
                  style={{ width: '80px' }}
                />
                <input
                  type="number"
                  className="form-control bg-dark text-light"
                  value={ej.sets}
                  onChange={(e) => handleEditEjercicio(ej.id, 'sets', Number(e.target.value))}
                  style={{ width: '80px' }}
                />
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteEjercicio(ej.id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button className="btn btn-success" onClick={handleSubmit}>
        Guardar Día
      </button>
    </div>
  );
};

export default RutinaDiaForm;