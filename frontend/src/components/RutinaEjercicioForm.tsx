import React from "react";

interface RutinaEjercicioFormProps {
  onSave: (rutinaEjercicio: {
    ejercicioId: number;
    sets: number;
    reps: number;
  }) => void;
}

const RutinaEjercicioForm: React.FC<RutinaEjercicioFormProps> = ({ onSave }) => {
  const [ejercicioId, setEjercicioId] = React.useState<string>(''); // string
  const [sets, setSets] = React.useState<string>(''); // string
  const [reps, setReps] = React.useState<string>(''); // string

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar antes de convertir
    if (!ejercicioId || !sets || !reps) return;

    onSave({
      ejercicioId: parseInt(ejercicioId),
      sets: parseInt(sets),
      reps: parseInt(reps),
    });

    // Reiniciar el formulario
    setEjercicioId('');
    setSets('');
    setReps('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Ejercicio ID</label>
        <input
          type="text"
          value={ejercicioId}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setEjercicioId(val); // solo números
          }}
          required
        />
      </div>
      <div>
        <label>Sets</label>
        <input
          type="text"
          value={sets}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setSets(val);
          }}
          required
        />
      </div>
      <div>
        <label>Reps</label>
        <input
          type="text"
          value={reps}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setReps(val);
          }}
          required
        />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default RutinaEjercicioForm;