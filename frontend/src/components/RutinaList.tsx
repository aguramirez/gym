import { useState, useEffect } from "react";
import { useRutinas, useEjercicios } from "../services/useDatos";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import RutinaForm from "./RutinaForm";
import "./rutinaList.css";
import authService from "../services/authService"; // Importamos el servicio de autenticación
import api from "../services/api"; // Añadir esta importación
import { config } from "../config/api.config"; // Añadir esta importación

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
  ejercicioVideo?: string;
}

interface RutinaDia {
  id?: number;
  nombre: string;
  rutinaEjercicios: RutinaEjercicio[];
}

interface Rutina {
  id?: number;
  nombre: string;
  clienteId?: number; // Hacemos clienteId explícito
  rutinaDias: RutinaDia[];
}

const RutinaList = () => {
  const { rutinas, fetchRutinas, loading: rutinasLoading } = useRutinas();
  const { ejercicios } = useEjercicios();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRutinas, setFilteredRutinas] = useState<any[]>([]);
  const [selectedRutina, setSelectedRutina] = useState<Rutina | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Filtrar rutinas cuando cambia el término de búsqueda
  useEffect(() => {
    if (!rutinas) return;
    
    if (!searchTerm.trim()) {
      setFilteredRutinas(rutinas);
      return;
    }
    
    const filtered = rutinas.filter(rutina => 
      rutina.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredRutinas(filtered);
  }, [searchTerm, rutinas]);

  // Manejador para hacer clic en una fila para ver detalles
  const handleRowClick = async (rutinaId: number) => {
    try {
      setIsLoading(true);
      const response = await api.get(`${config.RUTINAS_ENDPOINT}/${rutinaId}`);
      setSelectedRutina(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error("Error al obtener detalles de la rutina:", error);
      alert("No se pudo cargar la rutina");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFormModal = (rutina: Rutina | null = null) => {
    setSelectedRutina(rutina);
    setEditMode(!!rutina);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedRutina(null);
    setEditMode(false);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedRutina(null);
  };

  // Función para abrir el formulario de edición desde el modal de detalle
  const handleEditFromDetail = () => {
    setShowViewModal(false);
    setEditMode(true);
    setShowFormModal(true);
  };

  const handleDeleteRutina = async (id?: number) => {
    if (!id) return;
    
    if (!confirm("¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.")) {
      return;
    }
    
    try {
      setIsLoading(true);
      await api.delete(`${config.RUTINAS_ENDPOINT}/${id}`);
      await fetchRutinas();
      setShowViewModal(false); // Cerrar el modal de vista después de eliminar
      alert("Rutina eliminada con éxito");
    } catch (error: any) {
      console.error("Error al eliminar la rutina:", error);
      
      // Comprobar si el error es porque la rutina está asignada a clientes
      if (error.response?.status === 409 || 
          (error.response?.data && error.response.data.includes("integridad referencial"))) {
        alert("No se puede eliminar esta rutina porque está asignada a uno o más clientes");
      } else {
        alert(`Error al eliminar la rutina: ${error.response?.data || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRutina = async (rutina: Rutina) => {
    try {
      setIsLoading(true);
      
      // Asegurarnos de que clienteId esté establecido (lo tomamos de authService si no existe)
      if (!rutina.clienteId) {
        const currentUser = authService.getCurrentUser();
        rutina.clienteId = currentUser?.clienteId || undefined;
      }
      
      console.log("Guardando rutina con datos:", JSON.stringify(rutina));
      
      // Crear o actualizar rutina
      if (editMode && selectedRutina?.id) {
        await api.put(`${config.RUTINAS_ENDPOINT}/${selectedRutina.id}`, rutina);
        alert("Rutina actualizada con éxito");
      } else {
        await api.post(`${config.RUTINAS_ENDPOINT}`, rutina);
        alert("Rutina creada con éxito");
      }
      
      // Actualizar lista de rutinas
      await fetchRutinas();
      handleCloseFormModal();
    } catch (error: any) {
      console.error("Error al guardar la rutina:", error);
      
      let errorMsg = "Error al guardar la rutina";
      
      // Intentar obtener un mensaje de error más específico
      if (error.response?.data?.debugMessage) {
        if (error.response.data.debugMessage.includes("TransientObjectException")) {
          errorMsg = "Error: Problema con la referencia al cliente. Por favor, cierra sesión y vuelve a intentarlo.";
        } else {
          errorMsg = `Error: ${error.response.data.message}`;
        }
      } else if (error.message) {
        errorMsg = `Error: ${error.message}`;
      }
      
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rutinas-container">
      <div className="rutinas-header">
        <h1>Gestión de Rutinas</h1>
        <div className="rutinas-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar rutina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="btn-primary"
            onClick={() => handleOpenFormModal()}
            title="Crear Nueva Rutina"
          >
            <FaPlus /> Nueva Rutina
          </button>
        </div>
      </div>
      
      {isLoading && !showFormModal && !showViewModal ? (
        <div className="loading-indicator">
          <FaSpinner className="loading-spinner" />
          <p>Cargando rutinas...</p>
        </div>
      ) : (
        <div className="rutinas-list">
          {(!filteredRutinas || filteredRutinas.length === 0) ? (
            <div className="empty-list">
              <p>No hay rutinas disponibles</p>
              {searchTerm && <p>Prueba con un término de búsqueda diferente</p>}
              <button 
                className="btn-primary"
                onClick={() => handleOpenFormModal()}
              >
                <FaPlus /> Crear Primera Rutina
              </button>
            </div>
          ) : (
            <table className="rutinas-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Días</th>
                  <th>Ejercicios</th>
                </tr>
              </thead>
              <tbody>
                {filteredRutinas.map(rutina => (
                  <tr 
                    key={rutina.id} 
                    onClick={() => handleRowClick(rutina.id)}
                    className="clickable-row"
                  >
                    <td>{rutina.nombre}</td>
                    <td>{rutina.rutinaDias?.length || 0}</td>
                    <td>
                      {rutina.rutinaDias?.reduce((total: number, dia: any) => 
                        total + (dia.rutinaEjercicios?.length || 0), 0) || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal para crear/editar rutina */}
      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-container rutina-form-modal">
            <div className="modal-header">
              <h2>{editMode ? "Editar Rutina" : "Crear Nueva Rutina"}</h2>
              <button 
                className="btn-close" 
                onClick={handleCloseFormModal}
                disabled={isLoading}
              >×</button>
            </div>
            <div className="modal-body">
              <RutinaForm
                rutina={selectedRutina}
                ejercicios={ejercicios}
                onSave={handleSaveRutina}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles de la rutina */}
      {showViewModal && selectedRutina && (
        <div className="modal-overlay">
          <div className="modal-container rutina-view-modal">
            <div className="modal-header">
              <h2>{selectedRutina.nombre}</h2>
              <button 
                className="btn-close" 
                onClick={handleCloseViewModal}
              >×</button>
            </div>
            <div className="modal-body">
              <div className="rutina-details">
                {selectedRutina.rutinaDias && selectedRutina.rutinaDias.length > 0 ? (
                  <div className="rutina-dias">
                    {selectedRutina.rutinaDias.map((dia, index) => (
                      <div key={dia.id || index} className="rutina-dia">
                        <h3 className="dia-title">{dia.nombre}</h3>
                        
                        {dia.rutinaEjercicios && dia.rutinaEjercicios.length > 0 ? (
                          <table className="ejercicios-table">
                            <thead>
                              <tr>
                                <th>Ejercicio</th>
                                <th>Series</th>
                                <th>Repeticiones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dia.rutinaEjercicios.map((ejercicio, ejIndex) => {
                                // Obtener el nombre del ejercicio desde el ejercicioNombre o buscarlo en la lista
                                const ejercicioObj = ejercicios.find(e => e.id === ejercicio.ejercicioId);
                                const nombreEjercicio = ejercicio.ejercicioNombre || ejercicioObj?.nombre || 'Ejercicio desconocido';
                                
                                return (
                                  <tr key={ejercicio.id || ejIndex}>
                                    <td>{nombreEjercicio}</td>
                                    <td>{ejercicio.sets}</td>
                                    <td>{ejercicio.reps}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <p className="no-ejercicios">No hay ejercicios asignados a este día</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-dias">Esta rutina no tiene días asignados</p>
                )}
                
                <div className="detail-actions">
                  <button 
                    className="btn-warning"
                    onClick={handleEditFromDetail}
                  >
                    <FaEdit /> Editar Rutina
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={() => handleDeleteRutina(selectedRutina.id)}
                  >
                    <FaTrash /> Eliminar Rutina
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RutinaList;