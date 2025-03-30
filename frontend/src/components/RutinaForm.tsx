import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowLeft, FaSpinner } from "react-icons/fa";
import authService from "../services/authService"; // Importamos el servicio de autenticación

interface Ejercicio {
  id: number;
  nombre: string;
  video?: string;
}

interface RutinaEjercicio {
  id?: number;
  reps: number;
  sets: number;
  ejercicioId: number;
  ejercicioNombre?: string;
}

interface RutinaDia {
  id?: number;
  nombre: string;
  rutinaEjercicios: RutinaEjercicio[];
}

interface Rutina {
  id?: number;
  nombre: string;
  clienteId?: number; // Hacemos clienteId explícito aquí
  rutinaDias: RutinaDia[];
}

interface RutinaFormProps {
  rutina: Rutina | null;
  ejercicios: Ejercicio[];
  onSave: (rutina: Rutina) => Promise<void>;
  isLoading?: boolean;
}

const RutinaForm: React.FC<RutinaFormProps> = ({ 
  rutina, 
  ejercicios, 
  onSave,
  isLoading = false
}) => {
  const [nombre, setNombre] = useState("");
  const [rutinaDias, setRutinaDias] = useState<RutinaDia[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado para manejar la edición de un día específico
  const [editingDiaIndex, setEditingDiaIndex] = useState<number | null>(null);
  const [diaActual, setDiaActual] = useState<RutinaDia>({ nombre: "", rutinaEjercicios: [] });
  const [showDiaForm, setShowDiaForm] = useState(false);
  
  // Estado para manejar la edición de un ejercicio dentro de un día
  const [editingEjercicioIndex, setEditingEjercicioIndex] = useState<number | null>(null);
  const [ejercicioActual, setEjercicioActual] = useState<RutinaEjercicio>({ 
    reps: 0, 
    sets: 0, 
    ejercicioId: 0 
  });
  
  // Inicializar datos si es edición
  useEffect(() => {
    if (rutina) {
      setNombre(rutina.nombre || "");
      setRutinaDias(rutina.rutinaDias || []);
    } else {
      setNombre("");
      setRutinaDias([]);
    }
  }, [rutina]);
  
  // Validación del formulario
  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre de la rutina es obligatorio";
      isValid = false;
    }
    
    if (rutinaDias.length === 0) {
      newErrors.dias = "La rutina debe tener al menos un día";
      isValid = false;
    } else {
      for (let i = 0; i < rutinaDias.length; i++) {
        const dia = rutinaDias[i];
        if (!dia.nombre.trim()) {
          newErrors[`dia_${i}`] = `El día ${i + 1} necesita un nombre`;
          isValid = false;
        }
        
        if (dia.rutinaEjercicios.length === 0) {
          newErrors[`dia_ejercicios_${i}`] = `El día ${i + 1} debe tener al menos un ejercicio`;
          isValid = false;
        }
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Manejo del formulario de rutina
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Obtener el ID del usuario actual desde el servicio de autenticación
    const currentUser = authService.getCurrentUser();
    const clienteId = currentUser?.clienteId || undefined;
    
    // Crear objeto de rutina con clienteId explícito
    const rutinaData: Rutina = {
      id: rutina?.id,
      nombre,
      clienteId: clienteId, // Establecer el ID del cliente explícitamente
      rutinaDias
    };
    
    await onSave(rutinaData);
  };
  
  // Manejo de días
  const handleAddDia = () => {
    setDiaActual({ nombre: "", rutinaEjercicios: [] });
    setEditingDiaIndex(null);
    setShowDiaForm(true);
  };
  
  const handleEditDia = (index: number) => {
    setDiaActual({ ...rutinaDias[index] });
    setEditingDiaIndex(index);
    setShowDiaForm(true);
  };
  
  const handleDeleteDia = (index: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este día?")) {
      setRutinaDias(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const handleSaveDia = () => {
    if (!diaActual.nombre.trim()) {
      setErrors(prev => ({ ...prev, diaForm: "El nombre del día es obligatorio" }));
      return;
    }
    
    if (diaActual.rutinaEjercicios.length === 0) {
      setErrors(prev => ({ ...prev, diaForm: "Debes agregar al menos un ejercicio" }));
      return;
    }
    
    if (editingDiaIndex !== null) {
      // Actualizando día existente
      setRutinaDias(prev => prev.map((dia, i) => 
        i === editingDiaIndex ? diaActual : dia
      ));
    } else {
      // Agregando nuevo día
      setRutinaDias(prev => [...prev, diaActual]);
    }
    
    // Limpiar y cerrar el formulario
    setShowDiaForm(false);
    setDiaActual({ nombre: "", rutinaEjercicios: [] });
    setEditingDiaIndex(null);
    setErrors(prev => ({ ...prev, diaForm: "" }));
  };
  
  const handleCancelDia = () => {
    setShowDiaForm(false);
    setDiaActual({ nombre: "", rutinaEjercicios: [] });
    setEditingDiaIndex(null);
    setErrors(prev => ({ ...prev, diaForm: "" }));
  };
  
  // Manejo de ejercicios dentro de un día
  const handleAddEjercicio = () => {
    // Establecer valores iniciales para el nuevo ejercicio
    // Establecemos reps y sets con valores mínimos de 1 para que el formulario sea visible
    setEjercicioActual({ reps: 1, sets: 1, ejercicioId: 0 });
    setEditingEjercicioIndex(null);
  };
  
  const handleEditEjercicio = (index: number) => {
    setEjercicioActual({ ...diaActual.rutinaEjercicios[index] });
    setEditingEjercicioIndex(index);
  };
  
  const handleDeleteEjercicio = (index: number) => {
    setDiaActual(prev => ({
      ...prev,
      rutinaEjercicios: prev.rutinaEjercicios.filter((_, i) => i !== index)
    }));
  };
  
  const handleSaveEjercicio = () => {
    if (ejercicioActual.ejercicioId === 0) {
      setErrors(prev => ({ ...prev, ejercicioForm: "Debes seleccionar un ejercicio" }));
      return;
    }
    
    if (ejercicioActual.sets <= 0) {
      setErrors(prev => ({ ...prev, ejercicioForm: "El número de series debe ser mayor a 0" }));
      return;
    }
    
    if (ejercicioActual.reps <= 0) {
      setErrors(prev => ({ ...prev, ejercicioForm: "El número de repeticiones debe ser mayor a 0" }));
      return;
    }
    
    // Obtener el nombre del ejercicio seleccionado
    const ejercicioSeleccionado = ejercicios.find(e => e.id === ejercicioActual.ejercicioId);
    
    if (editingEjercicioIndex !== null) {
      // Actualizando ejercicio existente
      setDiaActual(prev => ({
        ...prev,
        rutinaEjercicios: prev.rutinaEjercicios.map((ej, i) => 
          i === editingEjercicioIndex ? {
            ...ejercicioActual,
            ejercicioNombre: ejercicioSeleccionado?.nombre
          } : ej
        )
      }));
    } else {
      // Agregando nuevo ejercicio
      setDiaActual(prev => ({
        ...prev,
        rutinaEjercicios: [
          ...prev.rutinaEjercicios,
          {
            ...ejercicioActual,
            ejercicioNombre: ejercicioSeleccionado?.nombre
          }
        ]
      }));
    }
    
    // Limpiar formulario
    setEjercicioActual({ reps: 0, sets: 0, ejercicioId: 0 });
    setEditingEjercicioIndex(null);
    setErrors(prev => ({ ...prev, ejercicioForm: "" }));
  };
  
  const handleCancelEjercicio = () => {
    setEjercicioActual({ reps: 0, sets: 0, ejercicioId: 0 });
    setEditingEjercicioIndex(null);
    setErrors(prev => ({ ...prev, ejercicioForm: "" }));
  };
  
  return (
    <div className="rutina-form">
      {/* Vista principal del formulario */}
      {!showDiaForm ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la Rutina</label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'error' : ''}`}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Rutina de Fuerza"
              disabled={isLoading}
              required
            />
            {errors.nombre && <div className="error-message">{errors.nombre}</div>}
          </div>
          
          <div className="form-group">
            <div className="section-header">
              <h3>Días de Entrenamiento</h3>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleAddDia}
                disabled={isLoading}
              >
                <FaPlus /> Agregar Día
              </button>
            </div>
            
            {errors.dias && <div className="error-message">{errors.dias}</div>}
            
            {rutinaDias.length > 0 ? (
              <div className="dias-list">
                {rutinaDias.map((dia, index) => (
                  <div key={dia.id || `dia-${index}`} className="dia-item">
                    <div className="dia-header">
                      <h4>{dia.nombre}</h4>
                      <span className="ejercicio-count">
                        {dia.rutinaEjercicios.length} ejercicios
                      </span>
                      <div className="dia-actions">
                        <button 
                          type="button" 
                          className="btn-icon btn-warning" 
                          onClick={() => handleEditDia(index)}
                          disabled={isLoading}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          type="button" 
                          className="btn-icon btn-danger" 
                          onClick={() => handleDeleteDia(index)}
                          disabled={isLoading}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    {errors[`dia_${index}`] && 
                      <div className="error-message">{errors[`dia_${index}`]}</div>}
                    
                    {errors[`dia_ejercicios_${index}`] && 
                      <div className="error-message">{errors[`dia_ejercicios_${index}`]}</div>}
                    
                    {dia.rutinaEjercicios.length > 0 && (
                      <div className="ejercicios-preview">
                        <table className="ejercicios-table compact">
                          <thead>
                            <tr>
                              <th>Ejercicio</th>
                              <th>Series</th>
                              <th>Reps</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dia.rutinaEjercicios.map((ejercicio, ejIndex) => (
                              <tr key={ejercicio.id || `ej-${ejIndex}`}>
                                <td>{ejercicio.ejercicioNombre || ejercicios.find(e => e.id === ejercicio.ejercicioId)?.nombre || 'Ejercicio'}</td>
                                <td>{ejercicio.sets}</td>
                                <td>{ejercicio.reps}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-dias">
                <p>No hay días de entrenamiento</p>
                <p>Haz clic en "Agregar Día" para comenzar a crear tu rutina</p>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="loading-spinner" />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave /> Guardar Rutina
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Formulario para agregar o editar día */
        <div className="dia-form">
          <div className="form-header">
            <button 
              type="button" 
              className="btn-back" 
              onClick={handleCancelDia}
              disabled={isLoading}
            >
              <FaArrowLeft /> Volver
            </button>
            <h3>{editingDiaIndex !== null ? 'Editar Día' : 'Agregar Nuevo Día'}</h3>
          </div>
          
          <div className="form-group">
            <label>Nombre del Día</label>
            <input
              type="text"
              className={`form-control ${errors.diaForm ? 'error' : ''}`}
              value={diaActual.nombre}
              onChange={(e) => setDiaActual(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej. Día 1 - Piernas"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <div className="section-header">
              <h4>Ejercicios</h4>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleAddEjercicio}
                disabled={isLoading || editingEjercicioIndex !== null}
              >
                <FaPlus /> Agregar Ejercicio
              </button>
            </div>
            
            {errors.diaForm && <div className="error-message">{errors.diaForm}</div>}
            
            {/* Lista de ejercicios del día actual */}
            {diaActual.rutinaEjercicios.length > 0 && (
              <div className="ejercicios-list">
                <table className="ejercicios-table">
                  <thead>
                    <tr>
                      <th>Ejercicio</th>
                      <th>Series</th>
                      <th>Repeticiones</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diaActual.rutinaEjercicios.map((ejercicio, index) => (
                      <tr key={ejercicio.id || `nuevo-ej-${index}`}>
                        <td>{ejercicio.ejercicioNombre || ejercicios.find(e => e.id === ejercicio.ejercicioId)?.nombre || 'Ejercicio'}</td>
                        <td>{ejercicio.sets}</td>
                        <td>{ejercicio.reps}</td>
                        <td>
                          <div className="ejercicio-actions">
                            <button 
                              type="button" 
                              className="btn-icon btn-warning sm" 
                              onClick={() => handleEditEjercicio(index)}
                              disabled={isLoading || editingEjercicioIndex !== null}
                            >
                              <FaEdit />
                            </button>
                            <button 
                              type="button" 
                              className="btn-icon btn-danger sm" 
                              onClick={() => handleDeleteEjercicio(index)}
                              disabled={isLoading}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Formulario para agregar/editar ejercicio */}
            {(editingEjercicioIndex !== null || ejercicioActual.ejercicioId !== 0 || ejercicioActual.sets > 0 || ejercicioActual.reps > 0 || ejercicioActual.sets === 1) && (
              <div className="ejercicio-form">
                <h5>{editingEjercicioIndex !== null ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</h5>
                
                {errors.ejercicioForm && <div className="error-message">{errors.ejercicioForm}</div>}
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Ejercicio</label>
                    <select
                      className="form-control"
                      value={ejercicioActual.ejercicioId}
                      onChange={(e) => setEjercicioActual(prev => ({ ...prev, ejercicioId: Number(e.target.value) }))}
                      disabled={isLoading}
                    >
                      <option value="0">Seleccionar ejercicio</option>
                      {ejercicios.map(ejercicio => (
                        <option key={ejercicio.id} value={ejercicio.id}>
                          {ejercicio.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Series</label>
                    <input
                      type="number"
                      className="form-control"
                      value={ejercicioActual.sets}
                      onChange={(e) => setEjercicioActual(prev => ({ ...prev, sets: Number(e.target.value) }))}
                      min="1"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Repeticiones</label>
                    <input
                      type="number"
                      className="form-control"
                      value={ejercicioActual.reps}
                      onChange={(e) => setEjercicioActual(prev => ({ ...prev, reps: Number(e.target.value) }))}
                      min="1"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="ejercicio-form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary sm" 
                    onClick={handleCancelEjercicio}
                    disabled={isLoading}
                  >
                    <FaTimes /> Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary sm" 
                    onClick={handleSaveEjercicio}
                    disabled={isLoading}
                  >
                    <FaSave /> {editingEjercicioIndex !== null ? 'Actualizar' : 'Agregar'}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleCancelDia}
              disabled={isLoading}
            >
              <FaTimes /> Cancelar
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleSaveDia}
              disabled={isLoading}
            >
              <FaSave /> Guardar Día
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RutinaForm;