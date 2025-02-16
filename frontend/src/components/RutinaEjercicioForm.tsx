import React from "react";

// Define el tipo del callback 'onSave'
interface RutinaEjercicioFormProps {
    onSave: (rutinaEjercicio: { ejercicioId: number; sets: number; reps: number }) => void;
}

const RutinaEjercicioForm: React.FC<RutinaEjercicioFormProps> = ({ onSave }) => {
    // Estados locales para los valores del formulario
    const [ejercicioId, setEjercicioId] = React.useState<number>(0);
    const [sets, setSets] = React.useState<number>(0);
    const [reps, setReps] = React.useState<number>(0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Llama al callback `onSave` con los datos
        onSave({ ejercicioId, sets, reps });

        // Reinicia el formulario si es necesario
        setEjercicioId(0);
        setSets(0);
        setReps(0);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Ejercicio ID</label>
                <input
                    type="number"
                    value={ejercicioId}
                    onChange={(e) => setEjercicioId(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label>Sets</label>
                <input
                    type="number"
                    value={sets}
                    onChange={(e) => setSets(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label>Reps</label>
                <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    required
                />
            </div>
            <button type="submit">Guardar</button>
        </form>
    );
};

export default RutinaEjercicioForm;