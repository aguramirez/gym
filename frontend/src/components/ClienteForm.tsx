import { useState, useEffect } from "react";
import { FaSpinner, FaTimes, FaSave } from "react-icons/fa";

// Definimos la interfaz Cliente
export interface Cliente {
  id?: number;
  nombre: string;
  dni: string;
  telefono: string;
  rol?: string;
}

interface ClienteFormProps {
  cliente?: Cliente | null;
  onClose: () => void;
  onSave: (cliente: Omit<Cliente, "id">, id?: number) => Promise<void> | void;
  isLoading?: boolean;
  editMode?: boolean;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ 
  cliente, 
  onClose, 
  onSave, 
  isLoading = false,
  editMode = false 
}) => {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("USER");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre || "");
      setDni(cliente.dni || "");
      setTelefono(cliente.telefono || "");
      setRol(cliente.rol || "USER");
    }
  }, [cliente]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
      isValid = false;
    }

    if (!dni.trim()) {
      newErrors.dni = "El DNI es obligatorio";
    } else if (!/^\d{8}$/.test(dni)) {
      newErrors.dni = "El DNI debe tener exactamente 8 dígitos";
      isValid = false;
    }

    if (!telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
      isValid = false;
    } else if (!/^\d{9}$/.test(telefono)) {
      newErrors.telefono = "El teléfono debe tener exactamente 9 dígitos";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const clienteData: Omit<Cliente, "id"> = {
      nombre,
      dni,
      telefono,
      rol
    };
    
    await onSave(clienteData, cliente?.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{editMode ? "Editar Cliente" : "Crear Nuevo Cliente"}</h2>
          <button 
            className="btn-close" 
            onClick={onClose}
            disabled={isLoading}
          >×</button>
        </div>
        <form onSubmit={handleSubmit} className="cliente-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              type="text"
              className={`form-control ${errors.nombre ? 'error' : ''}`}
              placeholder="Ingrese nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={isLoading}
              required
            />
            {errors.nombre && <div className="error-message">{errors.nombre}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="dni">DNI</label>
            <input
              id="dni"
              type="text"
              className={`form-control ${errors.dni ? 'error' : ''}`}
              placeholder="Ingrese DNI (8 dígitos)"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
              disabled={isLoading || (editMode && !!cliente?.id)}
              maxLength={8}
              required
            />
            {errors.dni && <div className="error-message">{errors.dni}</div>}
            {editMode && !!cliente?.id && (
              <div className="info-message">El DNI no se puede modificar</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="text"
              className={`form-control ${errors.telefono ? 'error' : ''}`}
              placeholder="Ingrese teléfono (9 dígitos)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
              disabled={isLoading}
              maxLength={9}
              required
            />
            {errors.telefono && <div className="error-message">{errors.telefono}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <select
              id="rol"
              className="form-control"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              disabled={isLoading}
            >
              <option value="USER">Usuario</option>
              <option value="TRAINER">Entrenador</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <div className="info-message">
              {rol === 'USER' && "Los usuarios pueden ver rutinas asignadas y registrar progreso"}
              {rol === 'TRAINER' && "Los entrenadores pueden gestionar rutinas y asignarlas a usuarios"}
              {rol === 'ADMIN' && "Los administradores tienen control total sobre el sistema"}
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
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
                  <FaSave /> {editMode ? "Guardar Cambios" : "Crear Cliente"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteForm;