import axios from "axios";
import { useState } from "react";

export interface NuevoEjercicio {
    id?: number
    nombre: string;
    link: string;
}

interface EjercicioFormProps {
    onSave: (nuevoEjercicio: NuevoEjercicio) => void;
    initialData: NuevoEjercicio | null;
}

function EjercicioForm({ onSave, initialData }: EjercicioFormProps) {
    const [nombre, setNombre] = useState<string>(initialData?.nombre || "");
    const [link, setLink] = useState<string>(initialData?.link || "");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const nuevoEjercicio: NuevoEjercicio = { nombre, link };
    
        try {
            const response = await axios.post("http://localhost:8080/ejercicios", nuevoEjercicio);
            onSave(response.data); // Notificar al componente padre con el ejercicio guardado
            setNombre("");
            setLink("");
        } catch (error) {
            console.error("Error al guardar el ejercicio:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre ejercicio</label>
                <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    placeholder="press banca"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="link" className="form-label">Link video</label>
                <input
                    type="text"
                    className="form-control"
                    id="link"
                    placeholder="youtube.com"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">
                {initialData ? "Actualizar Ejercicio" : "Guardar Ejercicio"}
            </button>
        </form>
    );
}

export default EjercicioForm;