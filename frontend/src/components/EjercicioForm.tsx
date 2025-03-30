import { useState, useEffect } from "react";
import { FaSpinner, FaTimes, FaSave } from "react-icons/fa";

export interface Ejercicio {
  id?: number;
  nombre: string;
  video: string;
}

interface EjercicioFormProps {
  onSave: (ejercicio: Ejercicio) => Promise<void>;
  initialData: Ejercicio | null;
  isLoading?: boolean;
  editMode?: boolean;
}

const EjercicioForm = ({ onSave, initialData, isLoading = false, editMode = false }: EjercicioFormProps) => {
  const [nombre, setNombre] = useState("");
  const [video, setVideo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Inicializar formulario con datos existentes
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setVideo(initialData.video || "");
    } else {
      setNombre("");
      setVideo("");
    }
  }, [initialData]);

  // Validación del formulario
  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre del ejercicio es obligatorio";
      isValid = false;
    }

    // Validación básica de URL para el video
    if (video.trim() && !isValidUrl(video)) {
      newErrors.video = "La URL del video no es válida";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Función para validar URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Crear objeto con los datos del ejercicio
    const ejercicioData: Ejercicio = {
      nombre,
      video
    };
    
    // Si estamos en modo edición, incluir el ID
    if (editMode && initialData?.id) {
      ejercicioData.id = initialData.id;
    }
    
    await onSave(ejercicioData);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="nombre">Nombre del ejercicio</label>
        <input
          id="nombre"
          type="text"
          className={`form-control ${errors.nombre ? 'error' : ''}`}
          placeholder="Ej. Press banca"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={isLoading}
          required
        />
        {errors.nombre && <div className="error-message">{errors.nombre}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="video">URL del video (opcional)</label>
        <input
          id="video"
          type="text"
          className={`form-control ${errors.video ? 'error' : ''}`}
          placeholder="https://www.youtube.com/watch?v=..."
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          disabled={isLoading}
        />
        {errors.video && <div className="error-message">{errors.video}</div>}
        <div className="info-message">
          Admite videos de YouTube, YouTube Shorts e Instagram
        </div>
      </div>
      
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          <FaTimes /> Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="loading-spinner" /> 
              {editMode ? "Guardando..." : "Creando..."}
            </>
          ) : (
            <>
              <FaSave /> {editMode ? "Guardar Cambios" : "Crear Ejercicio"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EjercicioForm;