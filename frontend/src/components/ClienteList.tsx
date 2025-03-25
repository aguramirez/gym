import { useState } from "react";
import axios from "axios";
import useDatos from "../services/useDatos";

interface Cliente {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  clienteRutinas?: ClienteRutina[];
}

interface Rutina {
  id: number;
  nombre: string;
}

interface ClienteRutina {
  id: number;
  rutina: Rutina;
}

const ClienteList: React.FC = () => {
  const { clientes, rutinas } = useDatos() as unknown as {
    clientes: Cliente[] | null;
    fetchClientes: () => Promise<void>;
    rutinas: Rutina[];
  };

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRutina, setSelectedRutina] = useState<string>("");

  // Función para obtener rutinas de un cliente
  const fetchRutinasDeCliente = async (clienteId: number) => {
    try {
      const response = await axios.get<Rutina[]>(`http://localhost:8080/clientes/${clienteId}/rutinas`);
      setSelectedCliente((prev) =>
        prev ? { ...prev, clienteRutinas: response.data.map((rutina) => ({ id: rutina.id, rutina })) } : null
      );
    } catch (error) {
      console.error("Error al obtener las rutinas del cliente:", error);
    }
  };

  const handleOpenModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
    fetchRutinasDeCliente(cliente.id); // Cargar rutinas del cliente al abrir el modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
    setSelectedRutina("");
  };

  const handleAsignarRutina = async () => {
    if (!selectedCliente || !selectedRutina) return;

    try {
      await axios.post("http://localhost:8080/cliente-rutinas/asignar", null, {
        params: {
          clienteId: selectedCliente.id,
          rutinaId: selectedRutina,
        },
      });

      await fetchRutinasDeCliente(selectedCliente.id);
      alert("Rutina asignada con éxito");
      // handleCloseModal();
    } catch (error: any) {
      console.error("Error al asignar rutina:", error);
      if (error.response?.data?.includes("El cliente ya tiene esta rutina asignada")) {
        alert("El cliente ya tiene esta rutina asignada");
      } else {
        alert("Error al asignar rutina");
      }
    }
  };


  const handleDesasignarRutina = async (rutinaId: number) => {
    if (!selectedCliente) return;

    // Verifica los valores antes de hacer la solicitud
    console.log("Desasignando rutina:", {
      clienteId: selectedCliente.id,
      rutinaId: rutinaId,
    });

    try {
      await axios.delete("http://localhost:8080/cliente-rutinas/desasignar", {
        params: {
          clienteId: selectedCliente.id,
          rutinaId: rutinaId,
        },
      });

      // Verifica que la rutina se haya desasignado correctamente
      console.log("Rutina desasignada correctamente");

      await fetchRutinasDeCliente(selectedCliente.id); // Actualiza las rutinas después de eliminar
      alert("Rutina desasignada con éxito");
    } catch (error) {
      // Agrega un log detallado del error
      console.error("Error al desasignar rutina:", error);
    }
  };


  return (
    <div className="list-container">
      <h1 className="list-title">Lista de Clientes</h1>
      {(!clientes || !Array.isArray(clientes) || clientes.length === 0) ? (
        <p>No hay clientes disponibles</p>
      ) : (
        <ul>
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              onClick={() => handleOpenModal(cliente)}
              className="list-item"
            >
              <span>{cliente.nombre}</span>
            </li>
          ))}
        </ul>
      )}

      {showModal && selectedCliente && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detalles de {selectedCliente.nombre}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <ul>
                  <li>DNI: {selectedCliente.dni}</li>
                  <li>TELEFONO: {selectedCliente.telefono}</li>
                </ul>
                <h4>Rutinas Asignadas</h4>
                <ul>
                  {selectedCliente.clienteRutinas?.length ? (
                    selectedCliente.clienteRutinas.map((cr) => (
                      <li key={cr.id} className="d-flex justify-content-between align-items-center">
                        <span>{cr.rutina.nombre}</span>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDesasignarRutina(cr.rutina.id)}
                        >
                          ❌
                        </button>
                      </li>
                    ))
                  ) : (
                    <p>No tiene rutinas asignadas</p>
                  )}
                </ul>

                <h4>Asignar Rutina</h4>
                <select
                  value={selectedRutina}
                  onChange={(e) => setSelectedRutina(e.target.value)}
                >
                  <option value="">Seleccione una rutina</option>
                  {rutinas.map((rutina) => (
                    <option key={rutina.id} value={rutina.id.toString()}>
                      {rutina.nombre}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleAsignarRutina}
                >
                  Asignar Rutina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteList;
