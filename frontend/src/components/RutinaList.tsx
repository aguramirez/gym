import axios from "axios";
import { useState } from "react";
import useDatos from "../services/useDatos";
import RutinaForm from "./RutinaForm";
import { FaTrash, FaEdit } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { LuRefreshCcw } from "react-icons/lu";
import RutinaView from "./RutinaView";  // Importa el componente RutinaView

const RutinaList = () => {
  const { rutinas, fetchRutinas } = useDatos();
  const [showModal, setShowModal] = useState(false);
  const [editingRutina, setEditingRutina] = useState<{ id?: number; nombre: string; rutinaDias: any[] } | null>(null);

  const [showRutinaViewModal, setShowRutinaViewModal] = useState<boolean>(false); // Estado para mostrar el modal de RutinaView
  const [selectedRutina, setSelectedRutina] = useState<{ id: number; nombre: string } | null>(null); // Rutina seleccionada para mostrar en RutinaView

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRutina(null);
  };

  const handleDelete = async (id?: number) => {
    try {
      await axios.delete(`http://localhost:8080/rutinas/${id}`);
      fetchRutinas(); // Refrescar la lista de rutinas
    } catch (error) {
      console.error("Error al eliminar la rutina:", error);
    }
  };

  const handleEdit = (rutina: { id?: number; nombre: string; rutinaDias?: any[] }) => {
    setEditingRutina({
      ...rutina,
      rutinaDias: rutina.rutinaDias || [], // Garantizar que rutinaDias sea un array
    });
    setShowModal(true);
  };

  const onSaveRutina = (nuevaRutina: { nombre: string }) => {
    // Si hay una rutina en edición, actualizamos, si no, es nueva
    if (editingRutina) {
      // Actualización de rutina
      axios.put(`http://localhost:8080/rutinas/${editingRutina.id}`, nuevaRutina)
        .then(() => {
          fetchRutinas(); // Refrescar lista
          handleCloseModal(); // Cerrar modal
        })
        .catch((error) => console.error("Error al actualizar rutina:", error));
    } else {
      // Creación de nueva rutina
      axios.post("http://localhost:8080/rutinas", nuevaRutina)
        .then(() => {
          fetchRutinas(); // Refrescar lista
          handleCloseModal(); // Cerrar modal
        })
        .catch((error) => console.error("Error al guardar la rutina:", error));
    }
  };

  const handleOpenRutinaViewModal = (rutina: { id: number; nombre: string }) => {
    setSelectedRutina(rutina);
    setShowRutinaViewModal(true); // Mostrar el modal de RutinaView
  };

  const handleCloseRutinaViewModal = () => {
    setShowRutinaViewModal(false);
    setSelectedRutina(null); // Resetear la rutina seleccionada
  };

  return (
    <>
      <h1 className="list-title">Lista de Rutinas</h1>
      <button className="btn btn-primary m-1" onClick={handleOpenModal}>
        <CgAddR />
      </button>
      <button className="btn btn-primary" onClick={fetchRutinas}>
        <LuRefreshCcw />
      </button>
      {/* Modal para crear o editar rutina */}
      {showModal && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingRutina ? "Editar Rutina" : "Nueva Rutina"}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <RutinaForm
                  onSave={onSaveRutina}
                  rutina={editingRutina} // Pasar la rutina seleccionada al formulario
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal para ver la rutina seleccionada */}
      {showRutinaViewModal && selectedRutina && (
        <RutinaView rutina={selectedRutina} onClose={handleCloseRutinaViewModal} />
      )}
      <div className="rutina-list-container">
        {rutinas.length === 0 ? (
          <p>No hay rutinas disponibles</p>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Editar</th>
                <th scope="col">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {rutinas.map((rutina, index) => (
                <tr key={rutina.id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <button
                      className="btn btn-link"
                      onClick={() => handleOpenRutinaViewModal(rutina)}
                    >
                      {rutina.nombre}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(rutina)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(rutina.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default RutinaList;