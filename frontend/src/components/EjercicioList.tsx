import { useState, useEffect } from "react";
import axios from "axios";
import { useEjercicios } from "../services/useDatos";
import { FaPlus, FaTrash, FaEdit, FaSpinner } from "react-icons/fa";
import EjercicioForm from "./EjercicioForm";
import EjercicioView from "./EjercicioView";
import authService from "../services/authService";
import "./componentStyles.css";

export interface Ejercicio {
  id?: number;
  nombre: string;
  video?: string;
}

const EjercicioList = () => {
  // Estados para manejar los datos y la interfaz
  const { ejercicios = [], fetchEjercicios } = useEjercicios();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEjercicios, setFilteredEjercicios] = useState<Ejercicio[]>([]);
  const [selectedEjercicio, setSelectedEjercicio] = useState<Ejercicio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar la lista filtrada cuando se cargan los ejercicios
  useEffect(() => {
    if (Array.isArray(ejercicios)) {
      setFilteredEjercicios(ejercicios);
    } else {
      setFilteredEjercicios([]);
    }
  }, [ejercicios]);

  // Filtrar ejercicios cuando cambia el término de búsqueda
  useEffect(() => {
    if (!Array.isArray(ejercicios)) return;
    
    if (!searchTerm.trim()) {
      setFilteredEjercicios(ejercicios);
      return;
    }
    
    const filtered = ejercicios.filter(ejercicio => 
      ejercicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredEjercicios(filtered);
  }, [searchTerm, ejercicios]);

  // Manejador para hacer clic en una fila y ver los detalles
  const handleRowClick = async (ejercicioId?: number) => {
    if (!ejercicioId) {
      console.error("ID de ejercicio no válido");
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.get<Ejercicio>(`http://localhost:8080/ejercicios/${ejercicioId}`, {
        headers: {
          'Authorization': authService.getToken()
        }
      });
      setSelectedEjercicio(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error("Error al obtener detalles del ejercicio:", error);
      setError("No se pudo cargar el ejercicio");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejadores para los modales
  const handleOpenFormModal = (ejercicio: Ejercicio | null = null) => {
    setSelectedEjercicio(ejercicio);
    setEditMode(!!ejercicio);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedEjercicio(null);
    setEditMode(false);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedEjercicio(null);
  };

  // Función para editar desde el modal de detalles
  const handleEditFromDetail = () => {
    setShowViewModal(false);
    setEditMode(true);
    setShowFormModal(true);
  };

  // Manejador para guardar o actualizar ejercicio
  const handleSaveEjercicio = async (ejercicio: Ejercicio) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Si estamos en modo edición, actualizar
      if (editMode && selectedEjercicio?.id) {
        await axios.put(
          `http://localhost:8080/ejercicios/${selectedEjercicio.id}`, 
          ejercicio,
          {
            headers: {
              'Authorization': authService.getToken()
            }
          }
        );
        alert("Ejercicio actualizado con éxito");
      } else {
        // Si no, crear nuevo
        await axios.post(
          "http://localhost:8080/ejercicios", 
          ejercicio,
          {
            headers: {
              'Authorization': authService.getToken()
            }
          }
        );
        alert("Ejercicio creado con éxito");
      }
      
      // Actualizar lista
      await fetchEjercicios();
      handleCloseFormModal();
    } catch (error: any) {
      console.error("Error al guardar ejercicio:", error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        if (error.response.status === 409) {
          setError("Ya existe un ejercicio con ese nombre");
        } else if (error.response.data && typeof error.response.data === 'string') {
          setError(error.response.data);
        } else {
          setError(`Error: ${error.response.status}`);
        }
      } else {
        setError("Error de conexión con el servidor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador para eliminar ejercicio
  const handleDeleteEjercicio = async (id?: number) => {
    if (!id) {
      console.error("ID de ejercicio no válido");
      return;
    }
    
    if (!confirm("¿Estás seguro de que deseas eliminar este ejercicio?")) return;
    
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:8080/ejercicios/${id}`, {
        headers: {
          'Authorization': authService.getToken()
        }
      });
      await fetchEjercicios();
      setShowViewModal(false); // Cerrar el modal de vista después de eliminar
      alert("Ejercicio eliminado con éxito");
    } catch (error: any) {
      console.error("Error al eliminar ejercicio:", error);
      
      // Manejar errores de eliminación
      if (error.response) {
        if (error.response.status === 409 || 
            (error.response.data && error.response.data.includes("integridad referencial"))) {
          alert("No se puede eliminar este ejercicio porque está siendo utilizado en una o más rutinas");
        } else {
          alert(`Error al eliminar: ${error.response.data || error.message}`);
        }
      } else {
        alert(`Error de conexión: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-section">
      <div className="section-header">
        <h1>Gestión de Ejercicios</h1>
        <div className="section-controls">
          {/* Barra de búsqueda */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar ejercicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Botón para nuevo ejercicio */}
          <button 
            className="btn-primary"
            onClick={() => handleOpenFormModal(null)}
            title="Agregar Nuevo Ejercicio"
          >
            <FaPlus /> Nuevo Ejercicio
          </button>
        </div>
      </div>
      
      {/* Indicador de carga */}
      {isLoading && !showFormModal && !showViewModal ? (
        <div className="loading-indicator">
          <FaSpinner className="loading-spinner" />
          <p>Cargando ejercicios...</p>
        </div>
      ) : (
        <div className="list-section">
          {/* Lista vacía o tabla de ejercicios */}
          {(!filteredEjercicios || filteredEjercicios.length === 0) ? (
            <div className="empty-list">
              <p>No hay ejercicios disponibles</p>
              {searchTerm && <p>Prueba con un término de búsqueda diferente</p>}
              <button 
                className="btn-primary"
                onClick={() => handleOpenFormModal(null)}
              >
                <FaPlus /> Crear Primer Ejercicio
              </button>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Video</th>
                </tr>
              </thead>
              <tbody>
                {filteredEjercicios.map(ejercicio => (
                  <tr 
                    key={ejercicio.id} 
                    onClick={() => handleRowClick(ejercicio.id)}
                    className="clickable-row"
                  >
                    <td>{ejercicio.nombre}</td>
                    <td>{ejercicio.video ? 'Disponible' : 'No disponible'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal para crear/editar ejercicio */}
      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editMode ? "Editar Ejercicio" : "Crear Nuevo Ejercicio"}</h2>
              <button 
                className="btn-close" 
                onClick={handleCloseFormModal}
                disabled={isLoading}
              >×</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <EjercicioForm
                onSave={handleSaveEjercicio}
                initialData={selectedEjercicio as any}
                isLoading={isLoading}
                editMode={editMode}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles del ejercicio */}
      {showViewModal && selectedEjercicio && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{selectedEjercicio.nombre}</h2>
              <button 
                className="btn-close" 
                onClick={handleCloseViewModal}
              >×</button>
            </div>
            <div className="modal-body">
              <EjercicioView 
                ejercicio={selectedEjercicio as Required<Ejercicio>} // Asegurar que tenga id
                onClose={handleCloseViewModal} 
                onEdit={handleEditFromDetail}
              />
              <div className="detail-actions">
                <button 
                  className="btn-warning"
                  onClick={handleEditFromDetail}
                >
                  <FaEdit /> Editar Ejercicio
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleDeleteEjercicio(selectedEjercicio.id)}
                >
                  <FaTrash /> Eliminar Ejercicio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EjercicioList;