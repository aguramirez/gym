import { useState, useEffect } from "react";
import { useClientes, useRutinas } from "../services/useDatos";
import { FaUserPlus, FaTrash, FaEdit, FaSpinner } from "react-icons/fa";
import { MdAssignmentAdd } from "react-icons/md";
import ClienteForm from "./ClienteForm";
import "./clienteList.css";
import api from "../services/api"; // Añadir esta importación
import { config } from "../config/api.config"; // Añadir esta importación

interface Cliente {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  rol?: string;
  clienteRutinas?: ClienteRutina[];
}

interface Rutina {
  id: number;
  nombre: string;
}

interface ClienteRutina {
  id: number;
  nombre: string;
  rutinaId: number;
}

// Función para verificar si un cliente es un usuario protegido
const isProtectedUser = (cliente: Cliente): boolean => {
  // Lista de DNIs de usuarios protegidos (mantener sincronizado con backend)
  const protectedDnis = ["41731091", "1"];
  return protectedDnis.includes(cliente.dni);
};

const ClienteList = () => {
  const { clientes, fetchClientes } = useClientes();
  const { rutinas } = useRutinas();

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRutina, setSelectedRutina] = useState<string>("");
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [clienteRutinas, setClienteRutinas] = useState<ClienteRutina[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [asignando, setAsignando] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Filtrar clientes cuando cambia el término de búsqueda
  useEffect(() => {
    if (!clientes) return;

    // Primero filtramos los usuarios protegidos de la lista
    const visibleClientes = clientes.filter(cliente => !isProtectedUser(cliente));

    if (!searchTerm.trim()) {
      setFilteredClientes(visibleClientes);
      return;
    }

    const filtered = visibleClientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.dni.includes(searchTerm)
    );

    setFilteredClientes(filtered);
  }, [searchTerm, clientes]);

  // Función para obtener rutinas de un cliente
  const fetchRutinasDeCliente = async (clienteId: number) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      console.log(`Obteniendo rutinas para el cliente ID: ${clienteId}`);

      // Intentemos directamente con el endpoint de clientes/rutinas que parece estar funcionando
      try {
        console.log(`Intentando obtener desde /clientes/${clienteId}/rutinas`);
        const clienteResponse = await api.get<any>(
          `${config.CLIENTES_ENDPOINT}/${clienteId}/rutinas`
        );

        if (Array.isArray(clienteResponse.data)) {
          console.log("Rutinas obtenidas desde /clientes endpoint:", clienteResponse.data);

          if (clienteResponse.data.length === 0) {
            console.log("El cliente no tiene rutinas asignadas");
            setClienteRutinas([]);
            // No establecemos mensaje de error, simplemente no hay rutinas
          } else {
            // Adaptamos el formato si es necesario
            const rutinasFormateadas = clienteResponse.data.map((rutina: any) => ({
              id: rutina.id || 0,
              nombre: rutina.nombre || "Rutina sin nombre",
              rutinaId: rutina.id || 0
            }));

            setClienteRutinas(rutinasFormateadas);
          }
        } else {
          console.error("La respuesta del cliente no es un array:", clienteResponse.data);
          setClienteRutinas([]);
          setErrorMessage("Formato de respuesta inesperado");
        }
      } catch (clienteError: any) {
        console.error("Error al obtener rutinas desde /clientes endpoint:", clienteError);

        // Intentamos con el segundo endpoint como fallback
        try {
          console.log(`Intentando obtener desde /cliente-rutinas/rutinas?clienteId=${clienteId}`);
          const response = await api.get<ClienteRutina[]>(
            `${config.CLIENTE_RUTINAS_ENDPOINT}/rutinas`,
            { params: { clienteId } }
          );

          if (Array.isArray(response.data)) {
            console.log("Rutinas obtenidas desde /cliente-rutinas endpoint:", response.data);
            setClienteRutinas(response.data);
          } else {
            console.error("La respuesta no es un array:", response.data);
            setClienteRutinas([]);
            setErrorMessage("Formato de respuesta inesperado");
          }
        } catch (rutinasError: any) {
          console.error("Error también en cliente-rutinas endpoint:", rutinasError);
          setClienteRutinas([]);

          // El cliente existe pero no tiene rutinas (inferimos esto del flujo de la app)
          if (clienteError.response?.status === 404) {
            // No establecemos mensaje de error, simplemente no hay rutinas
            console.log("Inferimos que el cliente no tiene rutinas asignadas");
          } else {
            setErrorMessage(`No se pudieron cargar las rutinas: ${clienteError.message}`);
          }
        }
      }
    } catch (error: any) {
      console.error("Error general al obtener las rutinas del cliente:", error);
      setClienteRutinas([]);
      setErrorMessage(`Error al cargar las rutinas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Abre el modal de detalles al hacer clic en una fila
  const handleRowClick = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowDetailModal(true);
  };

  // Cierra el modal de detalles
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCliente(null);
  };

  // Inicia la edición desde el modal de detalles
  const handleEditFromDetail = () => {
    if (selectedCliente) {
      setShowDetailModal(false);
      setEditMode(true);
      setShowFormModal(true);
    }
  };

  // Inicia la gestión de rutinas desde el modal de detalles
  const handleManageRutinasFromDetail = () => {
    if (selectedCliente) {
      setShowDetailModal(false);
      setShowModal(true);
      setClienteRutinas([]); // Resetear las rutinas
      setSelectedRutina("");
      setErrorMessage(null);

      if (selectedCliente && selectedCliente.id) {
        fetchRutinasDeCliente(selectedCliente.id);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
    setSelectedRutina("");
    setClienteRutinas([]);
    setErrorMessage(null);
  };

  // Manejo del modal de formulario
  const handleOpenFormModal = (cliente: Cliente | null = null) => {
    setSelectedCliente(cliente);
    setEditMode(!!cliente);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedCliente(null);
    setEditMode(false);
  };

  const handleSaveCliente = async (cliente: Omit<Cliente, "id">, id?: number) => {
    try {
      setIsLoading(true);

      // Si hay ID, es una actualización, si no, es creación
      if (id) {
        await api.put(`${config.CLIENTES_ENDPOINT}/${id}`, cliente);
      } else {
        await api.post(`${config.CLIENTES_ENDPOINT}`, {
          ...cliente,
          rol: cliente.rol || "USER" // Rol predeterminado
        });
      }

      await fetchClientes();

      handleCloseFormModal();
      alert(id ? "Cliente actualizado exitosamente" : "Cliente creado exitosamente");
    } catch (error: any) {
      console.error("Error al guardar cliente:", error);
      alert(`Error: ${error.response?.data || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCliente = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

    try {
      setIsLoading(true);
      await api.delete(`${config.CLIENTES_ENDPOINT}/${id}`);
      await fetchClientes();
      setShowDetailModal(false); // Cerrar el modal de detalle tras eliminar
      alert("Cliente eliminado exitosamente");
    } catch (error: any) {
      console.error("Error al eliminar cliente:", error);

      // Mostrar mensaje especial si el cliente está protegido
      if (error.response?.data?.message && error.response.data.message.includes("protegido")) {
        alert("Este usuario está protegido y no puede ser eliminado");
      } else {
        alert(`Error: ${error.response?.data || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsignarRutina = async () => {
    if (!selectedCliente || !selectedRutina) return;

    try {
      setAsignando(true);
      setErrorMessage(null);

      // Convertir el ID a número para asegurarnos de que coincide con lo esperado por el backend
      const rutinaId = parseInt(selectedRutina, 10);

      console.log(`Asignando rutina ${rutinaId} al cliente ${selectedCliente.id}`);

      await api.post(`${config.CLIENTE_RUTINAS_ENDPOINT}/asignar`, null, {
        params: {
          clienteId: selectedCliente.id,
          rutinaId: rutinaId,
        },
      });

      // Actualizar la lista de rutinas después de asignar
      await fetchRutinasDeCliente(selectedCliente.id);
      alert("Rutina asignada con éxito");

      // Limpiar selección
      setSelectedRutina("");
    } catch (error: any) {
      console.error("Error al asignar rutina:", error);

      // Mejorar el manejo de errores para evitar el error de "includes is not a function"
      let errorMsg = "Error al asignar rutina";

      if (error.response) {
        // Verificamos el tipo de datos que contiene error.response.data
        if (typeof error.response.data === 'string') {
          // Si es una cadena, podemos usar includes
          if (error.response.data.includes("El cliente ya tiene esta rutina asignada")) {
            errorMsg = "El cliente ya tiene esta rutina asignada";
          } else {
            errorMsg = error.response.data;
          }
        } else if (error.response.data && error.response.data.message) {
          // Si es un objeto con una propiedad message
          errorMsg = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMsg = "Datos inválidos o rutina ya asignada";
        } else if (error.response.status === 404) {
          errorMsg = "Cliente o rutina no encontrados";
        } else {
          errorMsg = `Error del servidor (${error.response.status})`;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
    } finally {
      setAsignando(false);
    }
  };

  const handleDesasignarRutina = async (rutinaId: number) => {
    if (!selectedCliente) return;

    if (!confirm("¿Estás seguro de que deseas desasignar esta rutina?")) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      console.log(`Desasignando rutina ${rutinaId} del cliente ${selectedCliente.id}`);

      await api.delete(`${config.CLIENTE_RUTINAS_ENDPOINT}/desasignar`, {
        params: {
          clienteId: selectedCliente.id,
          rutinaId: rutinaId,
        },
      });

      await fetchRutinasDeCliente(selectedCliente.id);
      alert("Rutina desasignada con éxito");
    } catch (error: any) {
      console.error("Error al desasignar rutina:", error);

      // Aplicamos el mismo patrón de manejo de errores mejorado
      let errorMsg = "Error al desasignar rutina";

      if (error.response) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.status === 404) {
          errorMsg = "Relación cliente-rutina no encontrada";
        } else {
          errorMsg = `Error del servidor (${error.response.status})`;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1>Gestión de Clientes</h1>
        <div className="clientes-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => handleOpenFormModal(null)}
            title="Agregar Nuevo Cliente"
          >
            <FaUserPlus /> Nuevo Cliente
          </button>
        </div>
      </div>

      {isLoading && !showModal && !showFormModal && !showDetailModal ? (
        <div className="loading-indicator">
          <FaSpinner className="loading-spinner" />
          <p>Cargando clientes...</p>
        </div>
      ) : (
        <div className="clientes-list">
          {(!filteredClientes || filteredClientes.length === 0) ? (
            <div className="empty-list">
              <p>No hay clientes disponibles</p>
              {searchTerm && <p>Prueba con un término de búsqueda diferente</p>}
            </div>
          ) : (
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map(cliente => (
                  <tr 
                    key={cliente.id} 
                    onClick={() => handleRowClick(cliente)}
                    className="clickable-row"
                  >
                    <td>{cliente.nombre}</td>
                    <td>
                      <span className={`badge ${cliente.rol === "ADMIN" ? "admin" :
                          cliente.rol === "TRAINER" ? "trainer" : "user"
                        }`}>
                        {cliente.rol || "USER"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal de detalles del cliente */}
      {showDetailModal && selectedCliente && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{selectedCliente.nombre}</h2>
              <button
                className="btn-close"
                onClick={handleCloseDetailModal}
              >×</button>
            </div>
            <div className="modal-body">
              <div className="cliente-detail">
                {/* <h3>{selectedCliente.nombre}</h3> */}
                <div className="cliente-info">
                  <p><strong>DNI:</strong> {selectedCliente.dni}</p>
                  <p><strong>Teléfono:</strong> {selectedCliente.telefono}</p>
                  <p><strong>Rol:</strong> <span className={`badge ${selectedCliente.rol === "ADMIN" ? "admin" : selectedCliente.rol === "TRAINER" ? "trainer" : "user"}`}>
                    {selectedCliente.rol || "USER"}
                  </span></p>
                </div>
                
                <div className="detail-actions">
                  <button 
                    className="btn-primary"
                    onClick={handleManageRutinasFromDetail}
                  >
                    <MdAssignmentAdd /> Gestionar Rutinas
                  </button>
                  <button 
                    className="btn-warning"
                    onClick={handleEditFromDetail}
                  >
                    <FaEdit /> Editar Cliente
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={() => handleDeleteCliente(selectedCliente.id)}
                  >
                    <FaTrash /> Eliminar Cliente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestión de rutinas */}
      {showModal && selectedCliente && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Rutinas de {selectedCliente.nombre}</h2>
              <button
                className="btn-close"
                onClick={handleCloseModal}
              >×</button>
            </div>
            <div className="modal-body">
              {/* <div className="cliente-info">
                <p><strong>DNI:</strong> {selectedCliente.dni}</p>
                <p><strong>Teléfono:</strong> {selectedCliente.telefono}</p>
                <p><strong>Rol:</strong> {selectedCliente.rol || "USER"}</p>
              </div> */}

              <h3>Rutinas Asignadas</h3>
              {isLoading ? (
                <div className="loading-indicator small">
                  <FaSpinner className="loading-spinner" />
                  <p>Cargando rutinas...</p>
                </div>
              ) : errorMessage ? (
                <div className="error-message">
                  {errorMessage}
                </div>
              ) : clienteRutinas.length > 0 ? (
                <div className="rutinas-asignadas">
                  {clienteRutinas.map(rutina => (
                    <div key={rutina.id} className="rutina-asignada-item">
                      <span>{rutina.nombre}</span>
                      <button
                        className="btn-danger sm"
                        onClick={() => handleDesasignarRutina(rutina.rutinaId)}
                        disabled={isLoading}
                      >
                        Desasignar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-rutinas">No tiene rutinas asignadas</p>
              )}

              <div className="asignar-rutina-section">
                <h3>Asignar Nueva Rutina</h3>
                <div className="asignar-controls">
                  <select
                    className="rutina-select"
                    value={selectedRutina}
                    onChange={(e) => setSelectedRutina(e.target.value)}
                    disabled={asignando}
                  >
                    <option value="">Seleccione una rutina</option>
                    {rutinas.map(rutina => (
                      <option key={rutina.id} value={rutina.id.toString()}>
                        {rutina.nombre}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn-primary"
                    onClick={handleAsignarRutina}
                    disabled={!selectedRutina || asignando}
                  >
                    {asignando ? (
                      <>
                        <FaSpinner className="loading-spinner" />
                        Asignando...
                      </>
                    ) : (
                      "Asignar Rutina"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear/editar cliente */}
      {showFormModal && (
        <ClienteForm
          cliente={selectedCliente}
          onClose={handleCloseFormModal}
          onSave={handleSaveCliente}
          isLoading={isLoading}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default ClienteList;