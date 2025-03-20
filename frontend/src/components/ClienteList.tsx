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
  const { clientes, fetchClientes, rutinas } = useDatos() as unknown as {
    clientes: Cliente[] | null; // Permite que sea null temporalmente
    fetchClientes: () => Promise<void>;
    rutinas: Rutina[];
  };

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRutina, setSelectedRutina] = useState<string>("");

  const handleOpenModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
    setSelectedRutina("");
  };

  const handleAsignarRutina = async () => {
    if (!selectedCliente || !selectedRutina) return;
  
    console.log("Cliente seleccionado:", selectedCliente); // Verifica la estructura
  
    try {
      await axios.post("http://localhost:8080/cliente-rutinas/asignar", null, {
        params: {
          clienteId: selectedCliente.id,
          rutinaId: selectedRutina,
        },
      });
      await fetchClientes();
      console.log("Rutinas del cliente después de asignar:", selectedCliente.clienteRutinas); // Verifica después de la asignación
      alert("Rutina asignada con éxito");
      handleCloseModal();
    } catch (error) {
      console.error("Error al asignar rutina:", error);
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
                  {selectedCliente.clienteRutinas?.map((cr) => (
                    <li key={cr.id}>{cr.rutina.nombre}</li>
                  ))}
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